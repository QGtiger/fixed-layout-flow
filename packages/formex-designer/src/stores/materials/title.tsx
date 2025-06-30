export default function Title(
  props: MaterialItemProps<{
    text: string;
  }>
) {
  return (
    <div className=" line-clamp-1 text-center text-xl font-semibold">
      {props.text}
    </div>
  );
}
