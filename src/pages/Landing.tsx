import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, Clock, Flame, Compass, Send } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { RestaurantCard } from "@/components/restaurant/RestaurantCard";
import { restaurants } from "@/data/restaurants";

const features = [
  {
    icon: Clock,
    title: "Predict delays",
    desc: "Live ETA risk based on kitchen load, distance, and time-of-day pressure.",
  },
  {
    icon: Flame,
    title: "Detect restaurant rush",
    desc: "We see the queue before you do — calm, busy, or fully slammed.",
  },
  {
    icon: Compass,
    title: "Recommend faster picks",
    desc: "Smart alternatives that match the cuisine and beat the wait.",
  },
];

const steps = [
  { n: "01", title: "Ask the assistant", desc: "Tell OrderSense what you're craving or name a restaurant." },
  { n: "02", title: "We analyze demand", desc: "Distance, queue depth, and peak-hour pressure feed our model." },
  { n: "03", title: "Order with confidence", desc: "Get smart picks ranked by speed, reliability, and rating." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-warm" />
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-32 h-[400px] w-[400px] rounded-full bg-warning/10 blur-3xl" />

        <div className="container relative pt-16 pb-24 md:pt-24 md:pb-32 grid lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-7"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-primary uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              AI for hungry humans
            </span>
            <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05]">
              Know the wait
              <br />
              <span className="text-primary">before you order.</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-xl leading-relaxed">
              OrderSense predicts kitchen delays, spots the rush, and quietly nudges you toward a faster, equally
              delicious option — before you tap "place order".
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/chat"
                className="group inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-bold shadow-soft-md hover:shadow-glow hover:bg-primary-hover active:scale-[0.98] transition-all"
              >
                Try the assistant
                <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link
                to="/dashboard"
                className="inline-flex items-center gap-2 rounded-full bg-surface border border-border px-6 py-3.5 font-bold hover:border-primary/40 hover:text-primary transition-colors"
              >
                See live demand
              </Link>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-success" />
                6 kitchens monitored
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-warning" />
                Live demand signal
              </div>
            </div>
          </motion.div>

          {/* Hero chat mockup */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            className="lg:col-span-5"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-primary blur-2xl opacity-20 rounded-[2rem]" />
              <div className="relative rounded-[2rem] bg-surface border border-border/60 shadow-soft-lg overflow-hidden">
                <div className="px-5 py-4 border-b border-border/60 flex items-center gap-2">
                  <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary">
                    <Sparkles className="h-3.5 w-3.5 text-primary-foreground" strokeWidth={2.5} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">OrderSense</div>
                    <div className="text-[10px] text-success font-bold flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-success" /> Online
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-4">
                  <div className="flex justify-end">
                    <div className="rounded-2xl rounded-br-md bg-foreground text-background px-4 py-2.5 text-sm max-w-[80%]">
                      Biryani from Spice Hub?
                    </div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="rounded-2xl rounded-bl-md bg-surface-alt px-4 py-3 text-sm max-w-[90%]"
                  >
                    <span className="text-muted-foreground">Spice Hub is </span>
                    <span className="font-bold text-destructive">slammed</span>
                    <span className="text-muted-foreground"> — 78% delay risk. Try </span>
                    <span className="font-bold text-foreground">Curry House</span>
                    <span className="text-muted-foreground"> — 24 mins, rated 4.6★.</span>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 }}
                  >
                    <RestaurantCard restaurant={restaurants[1]} highlighted compact />
                  </motion.div>
                </div>

                <div className="p-3 border-t border-border/60 bg-surface-alt/50">
                  <div className="flex items-center gap-2 rounded-full bg-surface border border-border px-4 py-2">
                    <input
                      readOnly
                      placeholder="Ask anything food-related…"
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <button className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground">
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container py-20 md:py-28">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            One assistant. <span className="text-primary">Three superpowers.</span>
          </h2>
          <p className="mt-4 text-muted-foreground text-lg">
            Built for the moment between hunger and decision.
          </p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: i * 0.08, ease: [0.25, 1, 0.5, 1] }}
              className="rounded-3xl bg-surface border border-border/60 p-7 shadow-soft-sm hover:shadow-soft-lg transition-shadow group"
            >
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-secondary text-primary group-hover:scale-110 transition-transform">
                <f.icon className="h-5 w-5" strokeWidth={2.25} />
              </div>
              <h3 className="mt-5 text-xl font-extrabold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="container py-20 md:py-28 border-t border-border/60">
        <div className="max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground text-lg">Three steps between craving and confident order.</p>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative rounded-3xl bg-gradient-warm border border-border/60 p-7"
            >
              <span className="text-5xl font-extrabold text-primary/30 tabular-nums">{s.n}</span>
              <h3 className="mt-3 text-xl font-extrabold">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container py-16">
        <div className="relative overflow-hidden rounded-[2rem] bg-foreground text-background p-10 md:p-16">
          <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl" />
          <div className="relative max-w-xl">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Stop guessing the wait. Start eating sooner.
            </h2>
            <p className="mt-4 text-background/70">
              Open the assistant and try a craving. We'll do the math.
            </p>
            <Link
              to="/chat"
              className="mt-8 inline-flex items-center gap-2 rounded-full bg-primary text-primary-foreground px-6 py-3.5 font-bold shadow-glow hover:bg-primary-hover active:scale-[0.98] transition-all"
            >
              Open OrderSense
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
