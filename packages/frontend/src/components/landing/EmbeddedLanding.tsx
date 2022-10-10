import { FC } from "react";
import { SetUsApart } from "./Apart";
import { ComingNext } from "./ComingNext";
import { motion } from 'framer-motion';
import { HowItWorks } from "./HowItWorks";
import { Footer } from "./Footer";
import { Hero } from "./Hero";
import { Banner } from "./Banner";

interface IEmbeddedLanding {

}

export const EmbeddedLanding: FC<IEmbeddedLanding> = (props: IEmbeddedLanding) => {
    return (
        <motion.div initial={{ opacity: 0 }} transition={{ duration: 0.5 }} animate={{ opacity: 1 }}>
            <Banner></Banner>
            <Hero ></Hero>
            <SetUsApart></SetUsApart>
            <HowItWorks></HowItWorks>
            <ComingNext></ComingNext>
            <Footer></Footer>
        </motion.div>
    )
};