import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ReactPaginate from 'react-paginate';
import '../css/App.css';

function Items(props) {
    return (
        <>
            {props.currentItems &&
                props.currentItems.map((item) => (
                    <div className='list-items'>
                        <div className='list-item-first'><strong style={{ fontSize: "25px" }}>{item.name}</strong><div><strong>Date: </strong>{item.date}</div></div>
                        <div className='list-item-description'>{item.description.length > 200 ? item.description.substring(0, 200) + "..." : item.description}</div>
                        <Link to='/eventdetail' state={{ "item": item, "showInvites": props.showInvites }}>Show Details</Link>
                    </div>
                ))}
        </>
    );
}

export default function EventList(props) {

    const [itemOffset, setItemOffset] = useState(0);
    const [itemsPerPage, setItemsPerPage] = useState(2);
    const [events, setEvents] = useState(props.events);
    const [sort, setSort] = useState('recent');
    const endOffset = itemOffset + itemsPerPage;
    const currentItems = events.slice(itemOffset, endOffset);
    const pageCount = Math.ceil(events.length / itemsPerPage);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itemsPerPage) % props.events.length;
        setItemOffset(newOffset);
    };

    const handleSort = () => {

        let sortedEvents = events;
        if (sort == 'old') {
            setSort('recent');
            sortedEvents.sort((a, b) => {
                if (a.date < b.date) {
                    return -1;
                }
                if (a.date > b.date) {
                    return 1;
                }
                return 0;
            });
        } else {
            setSort('old');
            sortedEvents.sort((a, b) => {
                if (a.date > b.date) {
                    return -1;
                }
                if (a.date < b.date) {
                    return 1;
                }
                return 0;
            });
        }

        console.log(sortedEvents);
        setEvents(sortedEvents);
    }

    const handleSearch = (e) => {
        const search = e.target.value.toLowerCase();
        console.log(search);
        let searchedEvents = [];
        if (search=='') {
            setEvents(props.events)
        } else {
            events.forEach(event => {
                if (event.name.toLowerCase().match(search) || event.description.toLowerCase().match(search)) {
                    searchedEvents.push(event);
                }
            });
            setEvents(searchedEvents);
        }
    }

    return (
        <>
            <div className='search-sort'>
                <input type='text' className='search' placeholder='Search' onChange={(e)=>handleSearch(e)}></input>
                <button className='button-sort' onClick={handleSort}>{sort == 'recent' ? 'Early' : 'Later'}</button>
            </div>
            { events.length==0 && !props.showInvites && (<center style={{paddingTop:'200px'}}>No Events Created</center>)}
            { events.length==0 && props.showInvites && (<center style={{paddingTop:'200px'}}>No Invitations</center>)}
            <Items currentItems={currentItems} showInvites={props.showInvites} />
            <div className='pagination'>
                <ReactPaginate
                    breakLabel="..."
                    nextLabel="Next->"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={5}
                    pageCount={pageCount}
                    previousLabel="<-Previous"
                    renderOnZeroPageCount={null}
                    containerClassName={"paging"}
                    previousLinkClassName={"paging-link"}
                    nextLinkClassName={"paging-link"}
                    pageLinkClassName={"paging-link"}
                    activeClassName={"paging-link"}
                    activeLinkClassName={"paging-link-active"}
                />
            </div>
        </>
    )
}
