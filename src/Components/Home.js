import React, { useContext } from "react";
import Sidebar from "./Sidebar/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import DashboardCard from "./Helper/Cards";
import { CiLocationArrow1 } from "react-icons/ci";
import { MdOutlineFamilyRestroom, MdOutlineCrisisAlert, MdOutlinePregnantWoman } from "react-icons/md";

export default function Home() {

  return (
    <>
      <Sidebar />
      <Container fluid className="dashboard-container">
        <Row className="dashboard-row">
          <Col md={3}>
            <div className="dashboard-box">
              <DashboardCard
                className="dash-card"
                title="Total members"
                value="0"
                color="#8cbed6"
                icon={<MdOutlineFamilyRestroom />}
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-box">
              <DashboardCard
                className="dash-card"
                title="Alert"
                value=""
                color="#8cbed6"
                icon={<MdOutlineCrisisAlert />}
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-box">
              <DashboardCard
                className="dash-card"
                title="My live location"
                value="Off"
                color="#8cbed6"
                icon={<CiLocationArrow1 />}
              />
            </div>
          </Col>
          <Col md={3}>
            <div className="dashboard-box">
              <DashboardCard
                className="dash-card"
                title="Outside members"
                value="0"
                color="#8cbed6"
                icon={<MdOutlinePregnantWoman />}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
}
