import React from 'react';
import PostContainer from '../components/PostContainer';
import user from '../assets/user.webp';
import { FaRegComments, FaRegCommentDots} from 'react-icons/fa';
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsCalendarDate } from "react-icons/bs";

function UserPage() {
    return (
    <main className='user-page-main-wrapper'>
        <section className='user-page-wrapper'>

            <div className='user-page-right-wrapper'>
            <img className='user-page-profile-img' src={user}/>
            <p className='user-page-username'>نام کاربری</p>

            </div>

            <div className='user-page-info-wrapper'>
                <div className='user-page-info-top'>
                        <div className='date-joined-wrapper'>
                            <BsCalendarDate className='user-page-icon'/>
                            <span className='date'>1402/12/29</span>
                        </div>
                        <div className='num-of-post-likes-wrapper'>
                            <FaArrowTrendUp className='user-page-icon'/>
                            <span className='post-likes-count'>456 لایک</span>
                        </div>
                </div>
                <div className='user-page-info-bottom'>
                    
                        <div className='num-of-posts-wrapper'>
                            <FaRegComments className='user-page-icon'/>
                            <span className='posts-count'>279 پست</span>
                        </div>
                        
                        <div className='num-of-comment-likes-wrapper'>
                            <FaRegCommentDots className='user-page-icon'/>
                            <span className='comment-likes-count'>782 کامنت</span>
                    </div>
                
                    
                </div>        
                        
            </div>




        </section>
        


    </main>
    

    );    
        
}

export default UserPage;