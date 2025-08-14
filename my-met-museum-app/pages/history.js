import { useAtom } from "jotai";
import { searchHistoryAtom } from "@/store";
import { useRouter } from "next/router";
import { ListGroup, Card, Button } from "react-bootstrap";
import styles from "@/styles/History.module.css";
import { removeFromHistory } from "@/lib/userData";

export default function History() {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const router = useRouter();

  if (!searchHistory) return null;

  function historyClicked(e, index) {
    router.push(`/artwork?${searchHistory[index]}`);
  }

  async function removeHistoryClicked(e, index) {
    e.stopPropagation();
    setSearchHistory(await removeFromHistory(searchHistory[index]));
  }

  return (
    <>
      {searchHistory.length === 0 ? (
        <Card>
          <Card.Body>
            <h4>Nothing Here</h4>
            Try searching for some artwork.
          </Card.Body>
        </Card>
      ) : (
        <ListGroup>
          {searchHistory.map((qs, idx) => {
            const params = new URLSearchParams(qs);
            return (
              <ListGroup.Item
                className={styles.historyListItem}
                key={idx}
                onClick={e => historyClicked(e, idx)}
              >
                {Array.from(params.entries()).map(([key, value]) => (
                  <span key={key}>
                    {key}: <strong>{value}</strong>{' '}
                  </span>
                ))}
                <Button
                  className="float-end"
                  variant="danger"
                  size="sm"
                  onClick={e => removeHistoryClicked(e, idx)}
                >×</Button>
              </ListGroup.Item>
            );
          })}
        </ListGroup>
      )}
    </>
  );
}
