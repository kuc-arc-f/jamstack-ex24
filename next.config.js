/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    MY_SITE_ID: 1,
    MY_SITE_NAME: "jamstack-ex-24",  
    APOLLO_SV_URI: "http://localhost:4000/graphql",
  },  
}
