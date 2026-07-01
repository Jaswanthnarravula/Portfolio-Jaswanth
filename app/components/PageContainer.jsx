export default function PageContainer({ children, wide = false, style = {} }) {
  return (
    <div
      style={{
        width: "min(1280px, calc(100% - 32px))",
        marginInline: "auto",
        ...(wide ? { width: "min(1400px, calc(100% - 32px))" } : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
}
