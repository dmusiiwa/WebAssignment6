import { useForm } from 'react-hook-form';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useRouter } from 'next/router';
import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";

export default function AdvancedSearch() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const router = useRouter();
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);

  function submitForm(data) {
    let queryString = `searchBy=${data.searchBy}`;
    if (data.geoLocation) queryString += `&geoLocation=${data.geoLocation}`;
    if (data.medium) queryString += `&medium=${data.medium}`;
    queryString += `&isOnView=${data.isOnView}`;
    queryString += `&isHighlight=${data.isHighlight}`;
    queryString += `&q=${data.q}`;
    setSearchHistory(current => [...current, queryString]);
    router.push(`/artwork?${queryString}`);
  }

  return (
    <Form onSubmit={handleSubmit(submitForm)}>
      <Form.Group className="mb-3">
        <Form.Label>Search Query</Form.Label>
        <Form.Control
          type="text"
          {...register('q', { required: true })}
          className={errors.q ? 'is-invalid' : ''}
        />
        {errors.q && <div className="invalid-feedback">This field is required</div>}
      </Form.Group>

      <Row className="mb-3">
        <Col md={4}>
          <Form.Label>Search By</Form.Label>
          <Form.Select {...register('searchBy')}>
            <option value="true">Title</option>
            <option value="false">Tags</option>
          </Form.Select>
        </Col>
        <Col md={4}>
          <Form.Label>Geo Location</Form.Label>
          <Form.Control type="text" {...register('geoLocation')} />
        </Col>
        <Col md={4}>
          <Form.Label>Medium</Form.Label>
          <Form.Control type="text" {...register('medium')} />
        </Col>
      </Row>

      <Form.Group className="mb-3">
        <Form.Check
          type="checkbox"
          label="On View"
          {...register('isOnView')}
        />
        <Form.Check
          type="checkbox"
          label="Highlighted"
          {...register('isHighlight')}
        />
      </Form.Group>

      <Button  type="submit"  style={{ backgroundColor: "#2f4358" }}>
        Submit
      </Button>
    </Form>
  );
}
