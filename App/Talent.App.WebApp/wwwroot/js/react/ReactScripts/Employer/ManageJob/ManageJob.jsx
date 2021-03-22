import React from 'react';
import ReactDOM from 'react-dom';
import Cookies from 'js-cookie';
import LoggedInBanner from '../../Layout/Banner/LoggedInBanner.jsx';
import { LoggedInNavigation } from '../../Layout/LoggedInNavigation.jsx';
import { JobSummaryCard } from './JobSummaryCard.jsx';
import { BodyWrapper, loaderData } from '../../Layout/BodyWrapper.jsx';
import { Pagination, Icon, Dropdown, Checkbox, Accordion, Form, Segment, Table } from 'semantic-ui-react';

export default class ManageJob extends React.Component {
    constructor(props) {
        super(props);
        let loader = loaderData
        loader.allowedUsers.push("Employer");
        loader.allowedUsers.push("Recruiter");
        //console.log(loader)
        this.state = {
            loadJobs: [],
            currentJobs: [],
            loaderData: loader,
            activePage: 1,
            sortBy: {
                date: "desc"
            },
            filter: {
                showActive: true,
                showClosed: false,
                showDraft: true,
                showExpired: true,
                showUnexpired: true
            },
            totalPages: 1,
            begin: 0,
            end: 2,
        }
        this.loadData = this.loadData.bind(this);
        this.init = this.init.bind(this);
        this.loadNewData = this.loadNewData.bind(this);
        //your functions go here
        this.onPaginate = this.onPaginate.bind(this);
    };

    init() {
        let loaderData = this.state.loaderData;
        loaderData.allowedUsers.push("Employer");
        loaderData.allowedUsers.push("Recruiter");
        loaderData.isLoading = false;
        this.setState({ loaderData, })
    }

    componentDidMount() {
        this.init();
        this.loadData();

    };

    loadData(callback) {
        var link = 'http://localhost:51689/listing/listing/getEmployerJobs';
        var cookies = Cookies.get('talentAuthToken');
       // your ajax call and other logic goes here
        $.ajax({
            url: link,
            headers: {
                'Authorization': 'Bearer ' + cookies,
                'Content-Type': 'application/json'
            },
            type: "GET",
            contentType: "application/json",
            dataType: "json",
            success: function (res) {
                let loadJobs = null;
                if (res.myJobs) {
                    loadJobs = res.myJobs
                }
           //     let jobList = Object.assign({}, this.state.loadJobs, loadJobs)
                this.setState(
                    {
                        loadJobs: loadJobs
                    })
                this.setState({
                    currentJobs: this.state.loadJobs.slice(this.state.begin, this.state.end)
                })
                console.log("all jobs...... begining");
                console.log(this.state.loadJobs);
                console.log("current jobs......begining");
                console.log(this.state.currentJobs);
            }.bind(this),
            error: function (res) {
                console.log(res.Message)
            }
            
        })
       this.init()
    }

    loadNewData(data) {
        var loader = this.state.loaderData;
        loader.isLoading = true;
        data[loaderData] = loader;
        this.setState(data, () => {
            this.loadData(() => {
                loader.isLoading = false;
                this.setState({
                    loadData: loader
                })
            })
        });
    }

    async onPaginate(event,
        data) {
        let currentPage = data.activePage;
        console.log("event data is............");
        console.log(data.activePage);
        console.log("current active page before setstate........");
        console.log(this.state.activePage);
        await this.setState(
            {
                activePage: currentPage
            })
        console.log("current active page is........");
        console.log(this.state.activePage);
        this.setState({ begin: this.state.activePage * 2 - 2 });
        console.log("begin........");
        console.log(this.state.begin);
        this.setState({ end: this.state.activePage * 2 });
        this.setState({
                    currentJobs: this.state.loadJobs.slice(this.state.begin, this.state.end)
                });
        console.log("current jobs......onpagination");
        console.log(this.state.currentJobs);
    }

    render() {
        let JobList = this.state.currentJobs;
        let JobDetails = null;
        if (JobList != "") {
            //let index = 0;
            //JobDetails = JobList.map((job,index) => {
            //    if (index >= this.state.begin && index <= this.state.end)                 
            //    return( 
            //        <Table.Row >
            //        <Table.Cell key={job.id}>
            //            <JobSummaryCard id={job.id} />
            //        </Table.Cell>
            //        </Table.Row >
            //        )
            //    index++;
            //}
            //);

            JobDetails = JobList.map(job =>                  
                    <Table.Row >
                    <Table.Cell key={job.id}>
                        <JobSummaryCard id={job.id} />
                    </Table.Cell>
                    </Table.Row >
            );
            
        }
        
        return (
            <BodyWrapper reload={this.init} loaderData={this.state.loaderData}>
                <div className="ui container">
                    <div className="sixteen wide left aligned padded column">
                        <h1>Create Job</h1>
                    </div>
                    <Table>
                        <Table.Body>
                            {JobDetails} 
                        </Table.Body>
                    </Table> 
                    <Pagination
                        activePage={this.state.activePage}
                        totalPages={Math.ceil(this.state.loadJobs.length / 2)}
                        onPageChange={this.onPaginate}
                         />
                </div>
            </BodyWrapper>
            
        )
    }
}