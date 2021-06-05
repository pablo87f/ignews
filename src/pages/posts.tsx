import { GetStaticProps } from "next";

import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";
import styles from "./home.module.scss";

export default function Posts() {
  return (
    <>
      <Head>
        <title>Posts | ig.news</title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <h1>
            <span>Posts</span>
          </h1>
        </section>
      </main>
    </>
  );
}

export async function getStaticProps(context) {
  return {
    props: {
      title: "Posts",
    },
  };
}
