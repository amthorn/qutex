import { CreateProjectModal } from "components/modals/CreateProjectModal";
import React from "react";
import { ServerTable } from "components/ServerTable";
import { withRouter } from "react-router-dom";
import { Col, Container, Row } from "react-bootstrap";
import { FaPlus, FaSearch, FaSort, FaSortAmountDown, FaSortAmountUp } from "react-icons/fa";

const getLastUpdated = (queues) => {
    const histories = [];
                                        
    // Parse first-used for display
    for(const queue of queues){
        for(const queueHistory of queue.history){
            histories.push(new Date(queueHistory.time).toUTCString());
        }
    }
    return histories.length === 0 ? undefined : histories.sort()[0];
};

export const Projects = withRouter(() =>
    <Container fluid={ true }>
        <Row>
            <Col>
                <CreateProjectModal 
                    openModalButtonProps={ { id: "createNewProjectButton", size: "lg", color: "info" } }
                    openModalButtonText={ <FaPlus size="16"/> }
                    help="Create a new project"
                />
            </Col>
        </Row>
        <Row>
            <Col>
                <ServerTable 
                    id="project_table"
                    url="/api/v1/projects/"
                    columns={ ["name", "current queue", "admins", "first used"] }
                    hover={ true }
                    striped={ true }
                    search={ true }
                    pagination={ true }
                    perPage={ true }
                    options={ {
                        sortable: ["name"],

                        icons: {
                            sortBase: FaSort,
                            sortUp: FaSortAmountUp,
                            sortDown: FaSortAmountDown,
                            search: FaSearch
                        },
                        
                        responseAdapter(respData) {
                            const projectData = [];
                            for(const project of respData.data){
                                
                                // Parse admins for display
                                const admins = [];
                                for(const admin of project.admins){
                                    admins.push(admin.displayName);
                                }

                                const lastUpdated = getLastUpdated(project.queues);
                                projectData.push({
                                    ...project,
                                    "current queue": project.currentQueue,
                                    admins: admins.join(", "),
                                    "first used": lastUpdated
                                });
                            }
                            
                            return {data: projectData, total: respData.total};
                        }
                    } }
                    
                    // onClick={ (a) => {
                    //     this.props.history.push(`/projects/${a.target.parentNode.getAttribute("data-id")}`);
                    // } }
                />
            </Col>
        </Row>
    </Container>
);