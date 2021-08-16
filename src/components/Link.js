export default function Link({ element, attributes, children }) {
  return (
    <a href={element.url} {...attributes}>
      {children}
    </a>
  );
}
