export function StoryCover({ url }: { url?: string }) {
  return (
    <div className="cover">
      {url ? <img src={url} alt="" width="480" height="640" loading="lazy" decoding="async" /> :
        <svg className="cover-placeholder" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinejoin="round" aria-hidden="true">
          <path d="M16 25c-4-3-8-4-13-3V8c5-1 9 0 13 3 4-3 8-4 13-3v14c-5-1-9 0-13 3Zm0-14v14" />
        </svg>}
    </div>
  );
}
