"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Users,
  Shield,
  MessageCircle,
  MapPin,
  Bot,
  DollarSign,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingUp,
  Globe,
  Smartphone,
  Monitor,
  Zap,
  Target,
  BarChart3,
  Calendar,
  Clock,
  Phone,
  Mail,
  Navigation,
  Gift,
  CreditCard,
  Activity,
  PieChart,
  Settings,
  HelpCircle,
  BookOpen,
  FileText,
  Image,
  Video,
  Mic,
  Download,
  Upload,
  Eye,
  Edit,
  Share,
  Heart,
  ThumbsUp,
  Share2,
  ExternalLink,
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  SortAsc,
  SortDesc,
  CheckCircle2,
  AlertCircle,
  Info,
  Lock,
  Unlock,
  Home,
  User,
  Bell,
  Truck,
  Route,
  Receipt,
  TrendingDown,
  Wallet,
  Banknote,
  Save,
  Download as DownloadIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ModeToggle } from "@/components/theme-toggle";
import AnimatedBackground from "@/components/animated-background";
import { useAuth } from "@/hooks/api/useAuth";

export default function LandingPage() {
  const { profile, authStatus } = useAuth();
  const user = profile.data?.user;
  const { isLoading, data: isAuthenticated } = authStatus;
  const router = useRouter();

  // Redirect authenticated users to their dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const roleRedirects: Record<string, string> = {
        admin: "/admin",
        operator: "/operator",
        supporter: "/supporter",
      };

      const redirectPath = roleRedirects[user.role || ""] || "/";
      router.push(redirectPath);
    }
  }, [isAuthenticated, user, isLoading, router]);
  // Animation variants
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const fadeInLeft = {
    initial: { opacity: 0, x: -60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const fadeInRight = {
    initial: { opacity: 0, x: 60 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const scaleIn = {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.5, ease: "easeOut" },
  };

  const features = [
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      title: "Smart Supporter Management",
      description:
        "Build your voter base with automated ID verification, digital registration, and intelligent supporter segmentation to maximize campaign reach",
      link: "/supporter",
      color: "bg-primary/10 text-primary",
    },
    {
      icon: <Shield className="h-8 w-8 text-accent" />,
      title: "Field Team Coordination",
      description:
        "Deploy and manage campaign operators with real-time GPS tracking, task assignment, and performance analytics to optimize ground operations",
      link: "/operator",
      color: "bg-accent/10 text-accent",
    },
    {
      icon: <MessageCircle className="h-8 w-8 text-secondary" />,
      title: "Multi-Channel Messaging",
      description:
        "Reach voters instantly through SMS, WhatsApp, and email campaigns with personalized templates and automated follow-up sequences",
      link: "/communication",
      color: "bg-secondary/10 text-secondary",
    },
    {
      icon: <MapPin className="h-8 w-8 text-warning" />,
      title: "Intelligent Route Planning",
      description:
        "Optimize campaign routes with interactive maps, polling station locations, and AI-powered logistics to maximize voter contact efficiency",
      link: "/transport",
      color: "bg-warning/10 text-warning",
    },
    {
      icon: <Bot className="h-8 w-8 text-info" />,
      title: "AI-Powered Voter Support",
      description:
        "Deploy intelligent chatbots for 24/7 voter assistance, fraud detection, and automated response systems to build trust and engagement",
      link: "/chatbot",
      color: "bg-info/10 text-info",
    },
    {
      icon: <DollarSign className="h-8 w-8 text-destructive" />,
      title: "Campaign Finance Management",
      description:
        "Track donations, manage expenses, and ensure compliance with transparent financial reporting and automated benefit distribution",
      link: "/funds",
      color: "bg-destructive/10 text-destructive",
    },
  ];

  const stats = [
    { label: "Campaigns Won", value: "47", change: "+23%" },
    { label: "Active Supporters", value: "12,450", change: "+15%" },
    { label: "Messages Delivered", value: "2.3M", change: "+45%" },
    { label: "Voters Reached", value: "89,230", change: "+67%" },
  ];

  return (
    <>
      <motion.div
        className="min-h-screen bg-background relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <AnimatedBackground />
        <motion.header
          className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50"
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="container flex h-14 sm:h-16 items-center justify-between px-4">
            <motion.div
              className="flex items-center space-x-2 sm:space-x-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-primary">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-primary-foreground" />
              </div>
              <h1 className="text-lg sm:text-xl font-bold text-foreground">
                <span className="hidden sm:inline">
                  Somaliland Candidate Helper
                </span>
                <span className="sm:hidden">Somaliland Helper</span>
              </h1>
            </motion.div>
            <motion.div
              className="flex items-center space-x-2 sm:space-x-4"
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Button
                variant="outline"
                size="sm"
                className="hidden sm:inline-flex"
                asChild
              >
                <Link href="/auth">Login</Link>
              </Button>
              <Button size="sm" className="sm:hidden" asChild>
                <Link href="/auth">Login</Link>
              </Button>
              <ModeToggle />
            </motion.div>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          className="py-12 sm:py-20 px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <div className="container mx-auto text-center">
            <motion.h2
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 sm:mb-6 leading-tight"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              Transform Somaliland's Democratic Future
            </motion.h2>
            <motion.p
              className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              The only all-in-one platform that empowers candidates, mobilizes
              supporters, and streamlines campaign operations across Somaliland.
              Join thousands of campaign teams already using our technology to
              win elections and strengthen democracy.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.8 }}
            >
              <Button
                size="lg"
                className="btn-gradient w-full sm:w-auto text-lg px-8 py-6"
                asChild
              >
                <Link href="/auth">Start Your Campaign Today</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto text-lg px-8 py-6"
                asChild
              >
                <Link href="#features">See How It Works</Link>
              </Button>
            </motion.div>
          </div>
        </motion.section>

        {/* Stats Section */}
        <motion.section
          className="py-16 px-4 bg-muted/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center"
                  variants={scaleIn}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="text-3xl font-bold text-foreground mb-2">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground mb-1">
                    {stat.label}
                  </div>
                  <div className="text-xs text-accent font-medium">
                    {stat.change}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Features Section */}
        <motion.section
          id="features"
          className="py-12 sm:py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-8 sm:mb-16"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Everything You Need to Win Elections
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                From supporter registration to real-time campaign analytics, our
                integrated platform gives you the competitive edge to mobilize
                voters, manage resources, and achieve electoral success across
                Somaliland.
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  variants={fadeInUp}
                  whileHover={{
                    y: -10,
                    transition: { type: "spring", stiffness: 300 },
                  }}
                >
                  <Card className="card-glass hover:shadow-strong transition-all duration-300">
                    <CardHeader>
                      <motion.div
                        className={`inline-flex h-12 w-12 items-center justify-center rounded-lg ${feature.color} mb-4`}
                        whileHover={{
                          rotate: 360,
                          transition: { duration: 0.6 },
                        }}
                      >
                        {feature.icon}
                      </motion.div>
                      <CardTitle className="text-xl font-semibold text-foreground">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-6">
                        {feature.description}
                      </p>
                      <Button variant="outline" className="w-full" asChild>
                        <Link href={feature.link}>
                          Explore Module
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.section>

        {/* Admin Dashboard Preview */}
        <motion.section
          className="py-20 px-4 bg-muted/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-8 sm:mb-16"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Admin Dashboard
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Comprehensive control center for campaign management and
                oversight
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Card className="card-glass max-w-4xl mx-auto">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-6 w-6 text-primary" />
                    Campaign Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    <div className="text-center p-3 sm:p-4 card-glass rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-foreground mb-1">
                        12,450
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Total Supporters
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 card-glass rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-accent mb-1">
                        156
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Active Operators
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 card-glass rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-warning mb-1">
                        28
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Transport Routes
                      </div>
                    </div>
                    <div className="text-center p-3 sm:p-4 card-glass rounded-lg">
                      <div className="text-xl sm:text-2xl font-bold text-secondary mb-1">
                        $85K
                      </div>
                      <div className="text-xs sm:text-sm text-muted-foreground">
                        Total Budget
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 text-center">
                    <Button className="btn-gradient" asChild>
                      <Link href="/admin">Access Admin Dashboard</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </motion.section>

        {/* Mobile Apps Preview */}
        <section className="py-20 px-4">
          <div className="container mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Mobile Applications
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dedicated mobile apps for operators and supporters with offline
                capabilities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Operator Mobile App
                </h3>
                <p className="text-muted-foreground mb-6">
                  Field operators can manage tasks, register supporters, upload
                  documents, and track their progress in real-time.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      GPS tracking and navigation
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Offline data synchronization
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Document capture and upload
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Real-time task updates
                    </span>
                  </li>
                </ul>
                <Button className="btn-gradient" asChild>
                  <Link href="/operator">Try Operator App</Link>
                </Button>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-foreground mb-4">
                  Supporter Portal
                </h3>
                <p className="text-muted-foreground mb-6">
                  Supporters can register, track their status, find polling
                  stations, and receive campaign updates.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Easy registration process
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Polling station locator
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">
                      Transport information
                    </span>
                  </li>
                  <li className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-accent" />
                    <span className="text-foreground">Campaign updates</span>
                  </li>
                </ul>
                <Button className="btn-gradient" asChild>
                  <Link href="/supporter">Access Portal</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <motion.section
          className="py-16 sm:py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto">
            <motion.div
              className="text-center mb-12 sm:mb-16"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Trusted by Campaign Teams Across Somaliland
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-3xl mx-auto">
                See how our platform has helped successful campaigns mobilize
                voters and achieve electoral victory
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              variants={staggerContainer}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
            >
              <motion.div variants={fadeInUp}>
                <Card className="card-glass hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "This platform transformed our campaign. We increased
                      voter registration by 340% and won the election with a 15%
                      margin. The real-time analytics helped us make data-driven
                      decisions every day."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Ahmed Hassan
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Mayor of Hargeisa
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-glass hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "The supporter management system is incredible. We
                      registered 8,000 supporters in just 2 weeks and maintained
                      95% data accuracy. The mobile app made field operations so
                      much more efficient."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-accent/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-accent" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Fatima Ali
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Campaign Manager, Berbera
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={fadeInUp}>
                <Card className="card-glass hover:shadow-strong transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-4 italic">
                      "The AI chatbot handled 2,000+ voter inquiries daily,
                      freeing up our team to focus on strategy. The fraud
                      detection system caught 15 suspicious activities that
                      could have compromised our campaign."
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center">
                        <User className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">
                          Omar Jama
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Technology Director, Borama
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Technology Stack */}
        <section className="py-12 sm:py-20 px-4 bg-muted/30">
          <div className="container mx-auto">
            <div className="text-center mb-8 sm:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                Built with Modern Technology
              </h2>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
                Leveraging cutting-edge technologies for performance, security,
                and scalability
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
              <div className="text-center p-4 sm:p-6 card-glass rounded-lg shadow-medium">
                <div className="text-lg sm:text-2xl font-bold text-primary mb-2">
                  Next.js 14
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  React Framework
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 card-glass rounded-lg shadow-medium">
                <div className="text-lg sm:text-2xl font-bold text-accent mb-2">
                  PostgreSQL
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Database
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 card-glass rounded-lg shadow-medium">
                <div className="text-lg sm:text-2xl font-bold text-warning mb-2">
                  Prisma
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  ORM
                </div>
              </div>
              <div className="text-center p-4 sm:p-6 card-glass rounded-lg shadow-medium">
                <div className="text-lg sm:text-2xl font-bold text-secondary mb-2">
                  Redis
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Caching
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <motion.section
          className="py-12 sm:py-20 px-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto text-center">
            <motion.h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground mb-4"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.4 }}
            >
              Join thousands of supporters and operators already using our
              platform to make a difference in Somaliland's democracy.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-md sm:max-w-none mx-auto"
              {...fadeInUp}
              transition={{ delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  className="btn-gradient w-full sm:w-auto"
                  asChild
                >
                  <Link href="/auth">Start Your Campaign</Link>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  asChild
                >
                  <Link href="/admin">View Demo</Link>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="border-t bg-muted/30 py-8 sm:py-12 px-4">
          <div className="container mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                    <Target className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    Somaliland Candidate Helper
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Empowering democratic participation through technology.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Platform</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="/admin" className="hover:text-foreground">
                      Admin Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link href="/operator" className="hover:text-foreground">
                      Operator App
                    </Link>
                  </li>
                  <li>
                    <Link href="/supporter" className="hover:text-foreground">
                      Supporter Portal
                    </Link>
                  </li>
                  <li>
                    <Link href="/auth" className="hover:text-foreground">
                      Authentication
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Modules</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link
                      href="/communication"
                      className="hover:text-foreground"
                    >
                      Communication
                    </Link>
                  </li>
                  <li>
                    <Link href="/transport" className="hover:text-foreground">
                      Transport
                    </Link>
                  </li>
                  <li>
                    <Link href="/chatbot" className="hover:text-foreground">
                      AI Chatbot
                    </Link>
                  </li>
                  <li>
                    <Link href="/funds" className="hover:text-foreground">
                      Funds & Resources
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-4">Support</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="hover:text-foreground">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              <p>
                &copy; 2025 Somaliland Candidate Helper. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
