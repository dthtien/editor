import { Button } from 'antd';
export default function Link({ element, attributes, children }) {
  return (
    <Button href={element.url} {...attributes} type="link">
      {children}
    </Button>
  );
}
