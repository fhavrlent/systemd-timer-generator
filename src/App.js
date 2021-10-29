import React, { useState } from "react";
import { Form, Container, Row, Col, Stack } from "react-bootstrap/";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";

export default function Home() {
  const [serviceName, setServiceName] = useState("");
  const [workingDirectory, setWorkingDirectory] = useState("");
  const [command, setCommand] = useState("");
  const [interval, setInterval] = useState("hourly");

  const disabled = !serviceName || !workingDirectory || !command || !interval;

  const serviceTemplate = `[Unit]
Description=${serviceName}

[Service]
Type=oneshot
ExecStart=${command}
WorkingDirectory=${workingDirectory}
  `;

  const timerTemplate = `[Unit]
Description=${serviceName}

[Timer]
OnCalendar=${interval}
Persistent=true

[Install]
WantedBy=timers.target
  `;

  const serviceData = new Blob([serviceTemplate], { type: "text/plain" });
  const serviceFile = window.URL.createObjectURL(serviceData);

  const timerData = new Blob([timerTemplate], { type: "text/plain" });
  const timerFile = window.URL.createObjectURL(timerData);

  const serviceNameWithDash = replaceSpace(serviceName);

  return (
    <Container>
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <Stack gap={4}>
            <h1>Systemd timer generator</h1>
            <span>
              Privacy: No trackers, no ads, no data are sent anywhere.
            </span>
            <Form>
              <Form.Group className="mb-3" controlId="serviceName">
                <Form.Label>Service Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="My Service"
                  value={serviceName}
                  onChange={(event) =>
                    setServiceName(event.currentTarget.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="workingDirectory">
                <Form.Label>Working Directory</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="/home/user/scripts"
                  value={workingDirectory}
                  onChange={(event) =>
                    setWorkingDirectory(event.currentTarget.value)
                  }
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="command">
                <Form.Label>Command to run</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Use absolute path"
                  value={command}
                  onChange={(event) => setCommand(event.currentTarget.value)}
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="interval">
                <Form.Label>
                  <a
                    href="https://man.archlinux.org/man/systemd.time.7"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Run Interval
                  </a>
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder="interval"
                  value={interval}
                  onChange={(event) => setInterval(event.currentTarget.value)}
                />
              </Form.Group>
              <Stack direction="horizontal" gap={3}>
                <Button
                  variant="primary"
                  href={serviceFile}
                  download={`${serviceNameWithDash}.service`}
                  disabled={disabled}
                  className="ml-1"
                >
                  Download Service file
                </Button>

                <Button
                  variant="primary"
                  href={timerFile}
                  download={`${serviceNameWithDash}.timer`}
                  disabled={disabled}
                >
                  Download Timer file
                </Button>
              </Stack>
            </Form>
            <div>
              <span>How to use:</span>
              <ol>
                <li>Download both files.</li>
                <li>
                  <code>
                    sudo cp {serviceNameWithDash || "name"}.service{" "}
                    {serviceNameWithDash || "name"}
                    .timer /etc/systemd/system/
                  </code>
                </li>
                <li>
                  <code>
                    sudo systemctl enable {serviceNameWithDash || "name"}.timer
                    && sudo systemctl start {serviceNameWithDash || "name"}
                    .timer
                  </code>
                </li>
              </ol>
            </div>
          </Stack>
        </Col>
      </Row>
    </Container>
  );
}

const replaceSpace = (serviceName) => serviceName.replace(/\s/g, "-");
