import React from 'react';
import { FaAngleUp } from "react-icons/fa";
import testData from '../assets/testData'

function SidePanelCard({title, groupName, author}) {
    return (
        <section className='card-container'>
            <header className='card-header'>
                <p className='card-title'>محبوب ترین گروه ها</p>
        
            </header>

            <div className='top-group-list'>
                <ol>
                    {testData.map((item)=> {
                     return (
                        <div className='top-group-flex'>
                            <FaAngleUp className='trend-icon'/>
                             <li key={item.id}><a className='single-top-group' href="#">{item.groupName}</a></li>
                             <p className='sub-count'>{item.subscriberCount} عضو</p>
                        </div>
                       
                     )   
                     
                    })}
                </ol>
                
            </div>

            <div className='top-panel-btn-container'>
                <button type='button' className='top-panel-btn'>همه گروه ها</button>
            </div>

            
        </section>
    );
}

export default SidePanelCard;