import React from 'react';
import { connect } from 'react-redux';
import { loadCommits, loadBuildSets } from '../redux/actions';
import Branches from './Branches';
import './styles/Commit.css';
import CommitsCard from './CommitsCard';
import Loading from './Loading';

class Commits extends React.Component {
 componentDidMount() {
  this.props.loadCommits();
  this.props.loadBuildSets();
 }

 renderBsid = id => {
  return <p key={id.bsid}>{id.bsid}</p>;
 };

 renderCommits = commit => {
  let filteredBs = this.props.buildData
   .map(obj => {
    return obj;
   })
   .filter(item => item.sourcestamps[0].revision === commit.sha);
  let BSID = filteredBs.map(id => {
   return id.bsid;
  });
  console.log(BSID);
  if (BSID) {
   var filterBReq = [];
   BSID.forEach(val => {
    filterBReq.push(
     this.props.bsid
      .map(obj => {
       return obj;
      })
      .filter(item => item.buildsetid === val)
    );
   });
   var mergedBsID = [].concat.apply([], filterBReq);
   var filterBuild = [];
   mergedBsID.forEach(val => {
    filterBuild.push(
     this.props.build
      .map(obj => {
       return obj;
      })
      .filter(item => item.buildrequestid === val.buildrequestid)
    );
   });
   var mergedBuild = [].concat.apply([], filterBuild);
   console.log(mergedBsID);
   console.log(mergedBuild);
  }

  return (
   <div className='panel-margin' key={commit.sha}>
    <CommitsCard commit={commit} />
    {filteredBs.map(this.renderBsid)}
   </div>
  );
 };

 render() {
  return (
   <div className='container margin'>
    <Branches />
    <h6>Current Branch:{this.props.branch}</h6>
    <h3>Latest Commits</h3>
    {this.props.isLoading.load ? (
     <Loading
      text={`Fetching latest Commits of ${this.props.branch} for you...`}
     />
    ) : (
     <div>
      <div>{this.props.commits.map(this.renderCommits)}</div>
      {this.props.error ? (
       <div className='error'>
        Unexpected Error occured. Kindly Reload the page
        <br />
        Err:{this.props.error}
       </div>
      ) : (
       <div>
        <button
         type='button'
         onClick={() => {
          this.props.loadCommits(this.props.page.prev);
         }}
         className='btn btn-primary '
         disabled={this.props.page.prev === null || this.props.error !== null}
        >
         <i className='fa fa-caret-left' aria-hidden='true' />
         Previous Page{' '}
        </button>{' '}
        <button
         type='button'
         onClick={() => {
          this.props.loadCommits(this.props.page.next);
         }}
         className='btn btn-primary'
         disabled={this.props.page.next === null || this.props.error !== null}
        >
         Next Page{'	'}
         <i className='fa fa-caret-right' aria-hidden='true' />
        </button>
        <footer className='blockquote-footer'>
         Page {this.props.page.next - 1}
        </footer>
        <div className='footer-blockquote' />
       </div>
      )}
     </div>
    )}
   </div>
  );
 }
}

// prettier-ignore
const mapStateToProps = ({ isLoading, commits, error, branch,page,buildData,bsid,build}) => ({
	isLoading,
	commits,
	error,
	branch,
    page,
    buildData,
    bsid,
    build
});

const mapDispatchToProps = dispatch => ({
 loadBuildSets: () => dispatch(loadBuildSets()),
 loadCommits: next => dispatch(loadCommits(next))
});

export default connect(
 mapStateToProps,
 mapDispatchToProps
)(Commits);
