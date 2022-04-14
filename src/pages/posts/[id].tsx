/* pdf print css add */
import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import { marked } from 'marked';

import Layout from '../../components/layout'
import LibCommon from '../../libs/LibCommon'
import LibCms from '../../libs/LibCms'
import LibPost from '@/libs/LibPost'
import LibGraphql from "@/libs/LibGraphql";
//
export default function Page({ blog, categoryItems }) {
//console.log(blog)
  let content = LibGraphql.getTagString(blog.content)
  content= marked.parse(content);
  let createdAt = LibCommon.converDatetimeString(blog.createdAt);
  let categoryName = LibPost.getCategoryName(categoryItems, blog.categoryId);
//console.log(categoryName);
  return (
    <Layout>
    <Head><title key="title">{blog.title}</title></Head>      
    <div className="container bg-light">
      <div className="hidden_print">
        <Link href="/home" >
          <a className="btn btn-light btnx-outline-orange mt-2">Back</a>
        </Link>
        <hr className="mt-2 mb-2" />
        <div className="show_head_wrap">
          <i className="bi bi-house-fill mx-2"></i> ＞
            &nbsp;{blog.title}
        </div>
      </div>
      <div className="card shadow-sm my-2">
        <div className="card-body">
          <h1>{blog.title}</h1>
          Date: {createdAt}<br />
          Category : {categoryName}
        </div>
      </div>
      <div className="shadow-sm bg-white p-4 mt-2 mb-4">
        <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}>
        </div>
      </div>                       
    </div>
    <style>{`
      div#post_item img{
        max-width : 100%;
        height : auto;
      }
      #post_item pre{
        background-color: #EEE;
        padding: 0.5rem;
      }      
      .show_head_wrap{ font-size: 1.4rem; }
      .pdf_next_page {
        page-break-before: always;
        background-color: green;
        border: none;        
      }
      @media print {
        .hidden_print{
          display: none;
        }
      }
      `}</style>      
  </Layout>
  )
}
//
export const getStaticPaths = async () => {
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
  const paths = []
  items.map((item, index) => {
    let row = { params: 
      { id: String(item.id) } 
    }
    paths.push(row)
  })
//console.log(paths)
  return {
    paths: paths,
    fallback: false
  } 
};
export const getStaticProps = async context => {
  const siteId = process.env.MY_SITE_ID;
  const id = context.params.id
// console.log(id)
  const data = await client.query({
    query: gql`
    query {
      post(id: ${id}) {
        id
        siteId
        title
        content
        categoryId
        createdAt
      }                  
    }
    ` ,
    fetchPolicy: "network-only"
  });
  let item = data.data.post;
  // category
  const categoryItems = await LibPost.getCategory(siteId)  
//console.log(categoryItems); 
//console.log(json.category_items )  
  return {
    props: { 
      blog: item, categoryItems: categoryItems
    },
  }
  
};

