import useSWR from 'swr';
import { Card, Button } from 'react-bootstrap';
import Link from 'next/link';
import Error from 'next/error';

export default function ArtworkCard({ objectID }) {
  const { data, error } = useSWR(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`);

  if (error) {
    return <Error statusCode={404} />;
  }

  if (!data) {
    return null;
  }

  const placeholderImage = "https://via.placeholder.com/375x375/cccccc/666666?text=No+Image";
  const imageUrl = data.primaryImageSmall || placeholderImage;

  return (
    <Card>
      <div style={{ height: '250px', overflow: 'hidden' }}>
        <Card.Img 
          variant="top" 
          src={imageUrl}
          style={{ 
            width: '100%', 
            height: '100%', 
            objectFit: 'cover' 
          }}
          onLoad={(e) => {
            console.log('Image loaded successfully:', e.target.src);
          }}
          onError={(e) => {
            console.log('Image failed to load:', e.target.src);
            e.target.src = placeholderImage;
          }}
        />
      </div>
      <Card.Body>
        <Card.Title>{data.title || "N/A"}</Card.Title>
        <Card.Text>
          <strong>Date:</strong> {data.objectDate || "N/A"}<br />
          <strong>Classification:</strong> {data.classification || "N/A"}<br />
          <strong>Medium:</strong> {data.medium || "N/A"}
        </Card.Text>
        <Link href={`/artwork/${objectID}`} passHref legacyBehavior>
          <Button variant="primary">{objectID}</Button>
        </Link>
      </Card.Body>
    </Card>
  );
}