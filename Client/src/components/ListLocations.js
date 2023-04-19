import { Col, Row, Card } from 'react-bootstrap';
import { Tooltip } from '@mui/material';
import Fade from '@mui/material/Fade';
import noImage from './asset/image-notfound.jpeg';

function ListLocations({ location }) {
    return (
        <Row>
            <Col
                key={location.id}
                md={4}
                className="mb-4"
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                }}
            >
                <Tooltip
                    title={location.name}
                    placement="left"
                    arrow
                    TransitionComponent={Fade}
                    TransitionProps={{ timeout: 600 }}
                >
                    <Card>
                        {/* Location Name */}
                        <Card.Title
                            style={{
                                fontWeight: "bold",
                                margin: "10px",
                                fontSize: "1.3rem",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                                width: "100%",
                                display: "block",
                            }}
                        >{location.name}</Card.Title>
                        {/* Location Image */}
                        <Card.Img
                            style={{
                                height: "400px",
                                width: '500px',
                                objectFit: "cover",
                                borderRadius: "0.5rem",
                                boxShadow: "0 0 30px 0 #000",
                            }}
                            src={location.image ? location.image : noImage}
                        />
                        <Card.Body>
                            {/* Address Text */}
                            <Card.Text
                                style={{
                                    fontSize: "1.1rem",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "block",
                                }}
                            >
                                {location.address.split(", ").map((line, index, arr) => {
                                    if (arr.length === 2 && index === 1) {
                                        return (
                                            <div key={index}>
                                                {line}
                                                <br />
                                                <br />
                                            </div>
                                        );
                                    } else {
                                        return <div key={index}>{line}</div>;
                                    }
                                })}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Tooltip>
            </Col>
        </Row>
    );
}

export default ListLocations;