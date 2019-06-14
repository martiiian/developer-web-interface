import React from 'react';
import { connect } from 'react-redux';
import { UncontrolledCollapse, CardBody, Card, CardHeader } from 'reactstrap';
import { loadCommits } from '../redux/actions';
import Branches from './Branches';
import './styles/Commit.css';
import Loading from './Loading';

class CommitsGrid extends React.Component {
	componentDidMount() {
		this.props.loadCommits();
	}
	renderCommits = commit => {
		let tog = 'toggler' + commit.sha;
		let committerDate = new Date(commit.commit.committer.date);
		let authorDate = new Date(commit.commit.author.date);
		let author = encodeURIComponent(commit.commit.author.name);
		let committer = encodeURIComponent(commit.commit.committer.name);
		return (
			<div key={commit.sha}>
				<Card>
					<CardHeader className='new' type='button' id={tog}>
						<div className='row'>
							<div className='col-sm'>{commit.sha.substring(0, 7)}</div>
							<div className='col-sm'>{commit.commit.committer.name}</div>
							<div className='col-sm'>{committerDate.toLocaleString()}</div>
							<div className='col-sm'>
								{commit.commit.message.substring(0, 17)}...
							</div>
						</div>
					</CardHeader>
					<UncontrolledCollapse toggler={tog}>
						<CardBody className='indent'>
							<div>
								<p>
									<strong>commit: </strong>{' '}
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={commit.html_url}
									>
										{commit.sha}
									</a>
								</p>
								<p>
									<strong>Commit Msg:</strong> {commit.commit.message}
								</p>
							</div>
							<div className='row'>
								<div className='col-sm'>
									<strong>Author: </strong>
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={`https://git.reactos.org/?p=reactos.git;a=search;s=${author};st=author`}
									>
										{commit.commit.author.name}
									</a>
								</div>
								<div className='col-sm'>
									<strong>Author Date: </strong>
									{authorDate.toLocaleString()}
								</div>
								<div className='col-sm'>
									<strong>Author Email: </strong>
									{commit.commit.author.email}
								</div>
							</div>
							<div className='row'>
								<div className='col-sm'>
									<strong>Committer: </strong>
									<a
										target='_blank'
										rel='noreferrer noopener'
										href={`https://git.reactos.org/?p=reactos.git;a=search;s=${committer};st=committer`}
									>
										{commit.commit.author.name}
									</a>
								</div>
								<div className='col-sm'>
									<strong>Committer Date: </strong>
									{committerDate.toLocaleString()}
								</div>
								<div className='col-sm'>
									<strong>Committer Email: </strong>
									{commit.commit.committer.email}
								</div>
							</div>
						</CardBody>
					</UncontrolledCollapse>
				</Card>
			</div>
		);
	};

	render() {
		return (
			<div>
				<div className='container'>
					<Branches />
					<h6>Current Branch:{this.props.branch}</h6>
					<h3>Latest Commits</h3>
					{this.props.isLoading ? (
						<div>
							<div>
								Fetching latest Commits of <strong>{this.props.branch} </strong>
								for you...
								<Loading />
							</div>
						</div>
					) : (
						<div>
							<div>{this.props.commits.map(this.renderCommits)}</div>
						</div>
					)}
					{this.props.commitError && (
						<div className='error'>
							Unexpected Error occured. Kindly Reload the page
							<br />
							Err:{this.props.commitError}
						</div>
					)}
				</div>
			</div>
		);
	}
}

const mapStateToProps = ({ isLoading, commits, commitError, branch }) => ({
	isLoading,
	commits,
	commitError,
	branch
});

const mapDispatchToProps = dispatch => ({
	loadCommits: () => dispatch(loadCommits())
});

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(CommitsGrid);
