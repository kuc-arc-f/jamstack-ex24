import Head from 'next/head'
import React from 'react'
import Link from 'next/link';
import { gql } from "@apollo/client";
import client from '@/apollo-client'
import { marked } from 'marked';

import Layout from '../../components/layout'
import LibCommon from '../../libs/LibCommon'
//import LibCms from '../../libs/LibCms'
import LibGraphql from "@/libs/LibGraphql";
import LibPost from '@/libs/LibPost'
//
export default function Page({ blog }) {
  let content = LibGraphql.getTagString(blog.content)
  content= marked.parse(content);
  let createdAt = LibCommon.converDatetimeString(blog.createdAt);
//  console.log(createdAt);
  return (
    <Layout>
    <Head><title key="title">{blog.title}</title></Head>      
    <div className="container bg-light">
      <div className="show_head_wrap">
        <i className="bi bi-house-fill mx-2"></i> ＞
          {blog.title}
      </div>
      <div className="card shadow-sm my-2">
        <div className="card-body">
          <h1>{blog.title}</h1>
          Date: {createdAt}<br />
        </div>
      </div>
      <div className="card shadow-sm mt-2 mb-4">
        <div className="card-body">
          <div id="post_item" dangerouslySetInnerHTML={{__html: `${content}`}}>
          </div>
        </div>
      </div> 
    </div>
    <style>{`
      div#post_item  img{
        max-width : 100%;
        height : auto;
      }
      div#post_item hr {
        height: 1px;
        background-color: #000;
        border: none;
      }
      .show_head_wrap{ font-size: 1.4rem; }
      `}</style>      
  </Layout>
  )
}
//
export const getStaticPaths = async () => {
  const siteId = process.env.MY_SITE_ID;
  const data = await client.query({
    query: gql`
    query {
      pages(siteId: ${siteId}) {
        id
        title
        content
        createdAt    
      }      
    }
    `,
    fetchPolicy: "network-only"
  });
//console.log(data.data.pages);  
  const page_items = data.data.pages
  const paths = []
  page_items.map((item, index) => {
    const row = { params: 
      { id: String(item.id) } 
    }
    paths.push(row)
  })
//console.log(page_items)
  return {
    paths: paths,
    fallback: false
  } 
};
export const getStaticProps = async context => {
  const id = context.params.id
//console.log(id);
  const data = await client.query({
    query: gql`
    query {
      page(id: ${id}) {
        id
        title
        content
        createdAt
      }            
    }
    `,
    fetchPolicy: "network-only"
  });
  const item = data.data.page;
//console.log(item );  
  return {
    props: { 
      blog: item,
    },
  }
  
};
