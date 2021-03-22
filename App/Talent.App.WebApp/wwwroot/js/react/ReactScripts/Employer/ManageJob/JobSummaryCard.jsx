import React from 'react';
import Cookies from 'js-cookie';
import { Popup } from 'semantic-ui-react';
import { Button, Card, Image } from 'semantic-ui-react'
import moment from 'moment';

export class JobSummaryCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loadJob: {
                jobDetails: {
                    location: []
                }
            }
        }
        this.selectJob = this.selectJob.bind(this)
    }

    componentDidMount() {
        this.selectJob(this.props.id);
    }

    selectJob(id) {
        var cookies = Cookies.get('talentAuthToken');
        var link ='http://localhost:51689/listing/listing/GetJobById'
        //url: 'http://localhost:51689/listing/listing/closeJob',
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            data: { id },
            success: function (res) {
                let loadJob = null;
                if (res.jobData) {
                    loadJob = res.jobData
                    this.setState({ loadJob: loadJob })                    
                }
            }.bind(this),
            error: function (res) {
                console.log(res.status)
            }
        })
    }

    render() {
    /*jobData: {
            title: "",
            description: "",
            logoUrl: "",
            summary: "",
            applicantDetails: {
                yearsOfExperience: { years: 0, months: 0 },
                qualifications: [],
                visaStatus:[]
            },
            jobDetails: {
                categories: { category: "", subCategory: "" },
                jobType: [],
                startDate: moment(),
                salary: { from: 0, to: 0 },
                location: { country: "", city: ""}
            }
        }
*/
        let job = this.state.loadJob;       
        let city = job.jobDetails['location'].city;
        let country = job.jobDetails['location'].country;
        let location = city + ", " + country;
        return(
            <Card.Group>
                <Card>
                    <Card.Content>

                        <Card.Header>{this.state.loadJob.title}</Card.Header>
                        <Card.Meta>{location}</Card.Meta>
                        <Card.Description>
                            {job.summary}
                        </Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                        <div className='ui one buttons'>
                            <Button color='red'>
                                Expired
                            </Button>
                        </div>
                        <div className='ui three buttons'>
                            <Button basic color='blue'>
                                Close
                            </Button>
                            <Button basic color='blue'>
                                Edit
                            </Button>
                            <Button basic color='blue'>
                                Copy
                            </Button>
                        </div>
                    </Card.Content>
                </Card>
                
            </Card.Group>

        )
    }
}