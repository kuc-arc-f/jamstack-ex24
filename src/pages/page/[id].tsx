import React from 'react'
import Link from 'next/link';
import Head from 'next/head';
import { gql } from "@apollo/client";
import client from '@/apollo-client'

import Layout from '../../components/layout'
import TopHeadBox from '../../components/TopHeadBox'
import PagingBox from '../../components/PagingBox'
import IndexRow from '../IndexRow';
import LibPagenate from '../../libs/LibPagenate'
import LibPost from '@/libs/LibPost'
import LibCommon from '../../libs/LibCommon'

//
function Page(data) {
  const items = data.blogs
  const paginateDisp = data.display
  const page = data.page
  const  categoryItems= data.categoryItems;
//console.log(data.categoryItems)  
  return (
    <Layout>
      <Head><title key="title">{data.site_name}</title></Head> 
      <div className="body_main_wrap">
        <TopHeadBox site_name={data.site_name} />
        <div className="container">
          <div className="body_wrap">
            <div id="post_items_box" className="row conte mt-2 mb-4">
              <div className="col-sm-12">
              </div>
              <div id="div_news">
                <h2 className="myblog_color_accent mt-2 mb-2" >Post</h2>
              </div>
              <div className="posts_items_row mb-2">
              {items.map((item, index) => {
//console.log(item.id ,item.categoryId )
                let createdAt = LibCommon.converDatetimeString(item.createdAt);
                let categoryName = LibPost.getCategoryName(categoryItems, item.categoryId);
//console.log(createdAt )
                return (<IndexRow key={index}
                  id={item.id} save_id={item.save_id} title={item.title}
                  date={createdAt} category_name={categoryName} />       
                )
              })}
              </div>
              <PagingBox page={page} paginateDisp={paginateDisp} />            
            </div>
          </div>          
        </div>
      </div>
      <style>{`
      .card_col_body{ text-align: left; width: 100%;}
      .card_col_icon{ font-size: 2.4rem; }
      .task_card_box{ width : 75%;}
      `}</style>      
    </Layout>
    )  
}
//
export const getStaticProps = async context => {
  const siteId = process.env.MY_SITE_ID;
  const page = context.params.id;
  LibPagenate.init()
  const pageInfo= LibPagenate.get_page_start(page)
  const data = await client.query({
    query: gql`
    query {
      posts(siteId: ${siteId}) {
        id
        title
        content
        categoryId
        createdAt    
      }                
    }
    `,
    fetchPolicy: "network-only"
  });
//console.log(data.data.posts);
  //category
  const categoryItems = await LibPost.getCategory(siteId)
  let items =  data.data.posts 
  const item_len = items.length 
  LibPagenate.init()
  items = LibPagenate.getOnepageItems(items, pageInfo.start , pageInfo.end )
// console.log(item_len)
  const display = LibPagenate.is_next_display(page, item_len )
  return {
    props : {
      blogs: items, display: display, page: page,
      site_name : process.env.MY_SITE_NAME, categoryItems: categoryItems,
    }
  };
}
export async function getStaticPaths() {
  let paths = []
  const siteId = process.env.MY_SITE_ID;
//console.log(siteId);
  const data = await client.query({
    query: gql`
    query {
      posts(siteId: ${siteId}) {
        id
        title
        content
        createdAt    
      }                
    }
    `,
    fetchPolicy: "network-only"
  });
//console.log(data.data.posts);
  const items = data.data.posts 
  LibPagenate.init()
  let pageMax =LibPagenate.get_max_page(items.length)
  pageMax = Math.ceil(pageMax)
//console.log( "pageMax=", pageMax )
  for(let i= 1 ; i<= pageMax; i++ ){
    let item = {
      params : {
        id: String(i)
      } 
    }
    paths.push(item)
  }
//console.log( items )
  return {
    paths: paths,
    fallback: false,
  }
}

export default Page
