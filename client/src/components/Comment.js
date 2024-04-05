import React from 'react';
import user from '../assets/user.webp';
import { FaRegThumbsUp, FaRegThumbsDown, FaReply, FaRegLightbulb, FaRegComments, FaRegCommentDots} from 'react-icons/fa';
import { FaArrowTrendUp } from "react-icons/fa6";
import { BsCalendarDate } from "react-icons/bs";



function Comment() {
    const commentBody =  'لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ، و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه و مجله در ستون و سطرآنچنان که لازم است، و برای شرایط فعلی تکنولوژی مورد نیاز، و کاربردهای متنوع با هدف بهبود ابزارهای کاربردی می باشد، کتابهای زیادی در شصت و سه درصد گذشته حال و آینده، شناخت فراوان جامعه و متخصصان را می طلبد، تا با نرم افزارها شناخت بیشتری را برای طراحان رایانه ای علی الخصوص طراحان خلاقی، و فرهنگ پیشرو در زبان فارسی ایجاد کرد، در این صورت می توان امید داشت که تمام و دشواری موجود در ارائه راهکارها، و شرایط سخت تایپ به پایان رسد و زمان مورد نیاز شامل حروفچینی دستاوردهای اصلی، و جوابگوی سوالات پیوسته اهل دنیای موجود طراحی اساسا مورد استفاده قرار گیرد.'
    return (
        <section className='comment-wrapper'>
            <article className='comment-author-info'>
                <div className='date-joined-wrapper'>
                    <BsCalendarDate className='date-joined-icon'/>
                    <span className='date'>1402/12/29</span>
                </div>
                <div className='num-of-posts-wrapper'>
                    <FaRegComments className='num-of-posts-icon'/>
                    <span className='posts-count'>279 پست</span>
                </div>
                <div className='num-of-post-likes-wrapper'>
                    <FaArrowTrendUp className='num-of-posts-likes-icon'/>
                    <span className='post-likes-count'>456 لایک</span>
                </div>
                <div className='num-of-comment-likes-wrapper'>
                    <FaRegCommentDots className='comment-likes-count-icon'/>
                    <span className='comment-likes-count'>782 کامنت</span>
                </div>
            </article>
            <article className='comment-body-wrapper'>
                <header className='comment-header'>
                    <div className='commenter-info'>
                        <img src={user} className='commenter-profile-pic' alt="تصویر پروفایل"/>
                        <p className='commenter-username'>علیرضا</p>
                    </div>
                    <p className='comment-date'>2 روز پیش</p>
                   
                </header>
                
                <p className='comment-body'>{commentBody}</p>
                <footer className='comment-footer'>
                    <div className='like-icon-wrapper'>
                        <span ><FaRegThumbsDown className='dislike-btn' /></span>
                        <span><p className='like-count'>256</p></span>
                        <span><FaRegThumbsUp className='like-btn'/></span>
                    </div>
                    <div className='comment-footer-reply-icon-wrapper'>
                        <FaReply className='comment-reply-icon'/>
                        <span>پاسخ دادن</span>
                    </div>
                    <div className='comment-footer-report-icon-wrapper'>
                       
                        <FaRegLightbulb className='comment-report-icon'/>
                        <span>گزارش</span>
                    </div>
                </footer>
            </article>
        </section>
    );
}

export default Comment;