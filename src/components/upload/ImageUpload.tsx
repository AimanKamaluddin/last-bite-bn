import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SIGNED_URL_TTL = 60 * 60 * 24 * 365 * 5; // 5 years

async function uploadOne(file: File, userId: string): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("Only image files are allowed");
  if (file.size > 5 * 1024 * 1024) throw new Error("Images must be under 5MB");
  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
  const { error } = await supabase.storage.from("uploads").upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
    contentType: file.type,
  });
  if (error) throw error;
  const { data, error: signErr } = await supabase.storage.from("uploads").createSignedUrl(path, SIGNED_URL_TTL);
  if (signErr || !data) throw signErr ?? new Error("Failed to create URL");
  return data.signedUrl;
}

interface Props {
  value: string | string[];
  onChange: (value: any) => void;
  multiple?: boolean;
  max?: number;
}

export function ImageUpload({ value, onChange, multiple = false, max = 6 }: Props) {
  const { user } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  const urls = multiple ? (Array.isArray(value) ? value : value ? [value as string] : []) : value ? [value as string] : [];

  const handleFiles = async (files: FileList | null) => {
    if (!files || !files.length || !user) return;
    setBusy(true);
    try {
      const remaining = multiple ? Math.max(0, max - urls.length) : 1;
      const list = Array.from(files).slice(0, remaining);
      const uploaded: string[] = [];
      for (const f of list) {
        uploaded.push(await uploadOne(f, user.id));
      }
      if (multiple) {
        onChange([...urls, ...uploaded]);
      } else {
        onChange(uploaded[0] ?? "");
      }
      toast.success(`Uploaded ${uploaded.length} image${uploaded.length > 1 ? "s" : ""}`);
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const remove = (i: number) => {
    if (multiple) onChange(urls.filter((_, idx) => idx !== i));
    else onChange("");
  };

  const canAdd = multiple ? urls.length < max : urls.length === 0;

  return (
    <div className="space-y-3">
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {urls.map((u, i) => (
            <div key={i} className="relative aspect-square overflow-hidden rounded-xl border bg-muted">
              <img src={u} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => remove(i)}
                className="absolute right-1 top-1 rounded-full bg-black/70 p-1 text-white hover:bg-black"
                aria-label="Remove image"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
      {canAdd && (
        <>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            multiple={multiple}
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <Button
            type="button"
            variant="outline"
            disabled={busy}
            onClick={() => inputRef.current?.click()}
            className="w-full rounded-2xl"
          >
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
            {busy ? "Uploading…" : multiple ? `Add photos (${urls.length}/${max})` : "Upload photo"}
          </Button>
          <p className="text-xs text-muted-foreground">JPG, PNG or WebP · up to 5MB each{multiple ? ` · up to ${max} photos` : ""}.</p>
        </>
      )}
    </div>
  );
}
