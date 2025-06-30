export default function Banner({
  background,
}: MaterialItemProps & { background: string }) {
  return (
    <div
      className="h-[180px] md:h-[240px]"
      style={{
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundImage: `url(${background})`,
      }}
    ></div>
  );
}
