export function StoryCover({ url }: { url?: string }) {
  return (
    <div className="cover">
      {url && <img src={url} alt="" width="480" height="640" loading="lazy" decoding="async" />}
    </div>
  );
}
