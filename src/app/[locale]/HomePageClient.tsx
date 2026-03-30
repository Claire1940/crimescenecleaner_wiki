'use client'

import { useEffect, useState, Suspense, lazy } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Check,
  ChevronDown,
  ClipboardCheck,
  Clock,
  ExternalLink,
  Hammer,
  Key,
  Map,
  MessageCircle,
  Package,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Star,
  TrendingUp,
  Trophy,
} from 'lucide-react'
import Link from 'next/link'
import { useMessages } from 'next-intl'
import { VideoFeature } from '@/components/home/VideoFeature'
import { LatestGuidesAccordion } from '@/components/home/LatestGuidesAccordion'
import { NativeBannerAd, AdBanner } from '@/components/ads'
import { scrollToSection } from '@/lib/scrollToSection'
import { DynamicIcon } from '@/components/ui/DynamicIcon'
import type { ContentItemWithType } from '@/lib/getLatestArticles'
import type { ModuleLinkMap } from '@/lib/buildModuleLinkMap'

// Lazy load heavy components
const HeroStats = lazy(() => import('@/components/home/HeroStats'))
const FAQSection = lazy(() => import('@/components/home/FAQSection'))
const CTASection = lazy(() => import('@/components/home/CTASection'))

// Loading placeholder
const LoadingPlaceholder = ({ height = 'h-64' }: { height?: string }) => (
  <div className={`${height} bg-white/5 border border-border rounded-xl animate-pulse`} />
)

// Conditionally render text as a link or plain span
function LinkedTitle({
  linkData,
  children,
  className,
  locale,
}: {
  linkData: { url: string; title: string } | null | undefined
  children: React.ReactNode
  className?: string
  locale: string
}) {
  if (linkData) {
    const href = locale === 'en' ? linkData.url : `/${locale}${linkData.url}`
    return (
      <Link
        href={href}
        className={`${className || ''} hover:text-[hsl(var(--nav-theme-light))] hover:underline decoration-[hsl(var(--nav-theme-light))/0.4] underline-offset-4 transition-colors`}
        title={linkData.title}
      >
        {children}
      </Link>
    )
  }
  return <>{children}</>
}

interface HomePageClientProps {
  latestArticles: ContentItemWithType[]
  moduleLinkMap: ModuleLinkMap
  locale: string
}

export default function HomePageClient({ latestArticles, moduleLinkMap, locale }: HomePageClientProps) {
  const t = useMessages() as any
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.crimescenecleaner.wiki'

  // Structured data
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: "Crime Scene Cleaner Wiki",
        description: "Complete Crime Scene Cleaner Wiki covering maps, tools, achievements, story, mixes, fixes, updates, and platform guides for Steam, Xbox, and PS5.",
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Crime Scene Cleaner - Gory First-Person Cleaning Simulator",
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteUrl}/search?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: "Crime Scene Cleaner Wiki",
        alternateName: "Crime Scene Cleaner",
        url: siteUrl,
        description: "Complete Crime Scene Cleaner Wiki resource hub for maps, tools, achievements, story, mixes, fixes, and platform guides",
        logo: {
          '@type': 'ImageObject',
          url: `${siteUrl}/android-chrome-512x512.png`,
          width: 512,
          height: 512,
        },
        image: {
          '@type': 'ImageObject',
          url: `${siteUrl}/images/hero.webp`,
          width: 1920,
          height: 1080,
          caption: "Crime Scene Cleaner Wiki - Gory First-Person Cleaning Simulator",
        },
        sameAs: [
          'https://store.steampowered.com/app/1040200/Crime_Scene_Cleaner/',
          'https://discord.com/invite/EjHuxvM',
          'https://www.reddit.com/r/CrimeSceneCleanerGame/',
          'https://x.com/Pres_Studio',
        ],
      },
      {
        '@type': 'VideoGame',
        name: "Crime Scene Cleaner",
        gamePlatform: ['PC', 'Steam', 'Xbox', 'PS5'],
        applicationCategory: 'Game',
        genre: ['Simulation', 'Horror', 'First-Person', 'Puzzle'],
        numberOfPlayers: {
          minValue: 1,
          maxValue: 1,
        },
        offers: {
          '@type': 'Offer',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
          url: 'https://store.steampowered.com/app/1040200/Crime_Scene_Cleaner/',
        },
      },
    ],
  }

  // FAQ accordion states
  const [faqExpanded, setFaqExpanded] = useState<number | null>(null)
  const [deckExpanded, setDeckExpanded] = useState<number | null>(null)
  const [secretsExpanded, setSecretsExpanded] = useState<number | null>(null)

  // Scroll reveal animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('scroll-reveal-visible')
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('.scroll-reveal').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      {/* 广告位 1: 移动端横幅 Sticky */}
      <div className="sticky top-20 z-20 border-b border-border py-2">
        <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />
      </div>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8 scroll-reveal">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                            bg-[hsl(var(--nav-theme)/0.1)]
                            border border-[hsl(var(--nav-theme)/0.3)] mb-6">
              <Sparkles className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />
              <span className="text-sm font-medium">{t.hero.badge}</span>
            </div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {t.hero.title}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto">
              {t.hero.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button
                onClick={() => scrollToSection('beginner-guide')}
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           bg-[hsl(var(--nav-theme))] hover:bg-[hsl(var(--nav-theme)/0.9)]
                           text-white rounded-lg font-semibold text-lg transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                {t.hero.getFreeCodesCTA}
              </button>
              <a
                href="https://store.steampowered.com/app/1040200/Crime_Scene_Cleaner/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-8 py-4
                           border border-border hover:bg-white/10 rounded-lg
                           font-semibold text-lg transition-colors"
              >
                {t.hero.playOnSteamCTA}
                <ArrowRight className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Stats */}
          <Suspense fallback={<LoadingPlaceholder height="h-32" />}>
            <HeroStats stats={Object.values(t.hero.stats)} />
          </Suspense>
        </div>
      </section>

      {/* 广告位 2: 原生横幅 */}
      <NativeBannerAd adKey={process.env.NEXT_PUBLIC_AD_NATIVE_BANNER || ''} />

      {/* Video Section */}
      <section className="px-4 py-12">
        <div className="scroll-reveal container mx-auto">
          <div className="relative rounded-2xl overflow-hidden">
            <VideoFeature
              videoId="Az2hbxR_Me0"
              title="Crime Scene Cleaner - Release Trailer"
              posterImage="/images/hero.webp"
            />
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <LatestGuidesAccordion articles={latestArticles} locale={locale} max={30} />

      {/* 广告位 3: 标准横幅 728×90 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Tools Grid - 16 Navigation Cards */}
      <section className="px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              {t.tools.title}{' '}
              <span className="text-[hsl(var(--nav-theme-light))]">
                {t.tools.titleHighlight}
              </span>
            </h2>
            <p className="text-muted-foreground text-lg">
              {t.tools.subtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {t.tools.cards.map((card: any, index: number) => {
              // 映射卡片索引到 section ID
              const sectionIds = [
                'beginner-guide', 'walkthrough', 'upgrades-guide', 'mop-skills',
                'money-guide', 'perfect-score', 'achievements', 'secrets',
                'cassette-tapes', 'bodies-evidence', 'true-cleaner', 'nightmare-mode',
                'act2-walkthrough', 'act2-secrets', 'detergents', 'system-info'
              ]
              const sectionId = sectionIds[index]

              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(sectionId)}
                  className="scroll-reveal group p-6 rounded-xl border border-border
                             bg-card hover:border-[hsl(var(--nav-theme)/0.5)]
                             transition-all duration-300 cursor-pointer text-left
                             hover:shadow-lg hover:shadow-[hsl(var(--nav-theme)/0.1)]"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="w-12 h-12 rounded-lg mb-4
                                  bg-[hsl(var(--nav-theme)/0.1)]
                                  flex items-center justify-center
                                  group-hover:bg-[hsl(var(--nav-theme)/0.2)]
                                  transition-colors">
                    <DynamicIcon
                      name={card.icon}
                      className="w-6 h-6 text-[hsl(var(--nav-theme-light))]"
                    />
                  </div>
                  <h3 className="font-semibold mb-2">{card.title}</h3>
                  <p className="text-sm text-muted-foreground">{card.description}</p>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* 广告位 4: 方形广告 300×250 */}
      <AdBanner type="banner-300x250" adKey={process.env.NEXT_PUBLIC_AD_BANNER_300X250} />

      {/* Module 1: Beginner Guide */}
      <section id="beginner-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['cscBeginnerGuide']} locale={locale}>
                {t.modules.cscBeginnerGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
              {t.modules.cscBeginnerGuide.intro}
            </p>
          </div>

          {/* Steps */}
          <div className="scroll-reveal space-y-4 mb-10">
            {t.modules.cscBeginnerGuide.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`cscBeginnerGuide::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Tips */}
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold text-lg">Quick Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.cscBeginnerGuide.quickTips.map((tip: string, index: number) => (
                <li key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 广告位 5: 中型横幅 468×60 */}
      <AdBanner type="banner-468x60" adKey={process.env.NEXT_PUBLIC_AD_BANNER_468X60} />

      {/* Module 2: Apotheosis Crafting */}
      <section id="walkthrough" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscWalkthrough']} locale={locale}>{t.modules.cscWalkthrough.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscWalkthrough.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.cscWalkthrough.cards.map((card: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <h3 className="font-bold text-lg mb-2 text-[hsl(var(--nav-theme-light))]">
                  <LinkedTitle linkData={moduleLinkMap[`cscWalkthrough::cards::${index}`]} locale={locale}>
                    {card.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{card.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.cscWalkthrough.milestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 3: Tools and Weapons */}
      <section id="upgrades-guide" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscUpgradesGuide']} locale={locale}>{t.modules.cscUpgradesGuide.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscUpgradesGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.cscUpgradesGuide.items.map((item: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Hammer className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{item.type}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`cscUpgradesGuide::items::${index}`]} locale={locale}>
                    {item.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 4: Storage and Inventory */}
      <section id="mop-skills" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscMopSkills']} locale={locale}>{t.modules.cscMopSkills.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscMopSkills.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.cscMopSkills.solutions.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`cscMopSkills::solutions::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.role}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-[hsl(var(--nav-theme)/0.05)] border border-[hsl(var(--nav-theme)/0.3)] rounded-xl">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
              <h3 className="font-bold">Management Tips</h3>
            </div>
            <ul className="space-y-2">
              {t.modules.cscMopSkills.managementTips.map((tip: string, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                  <span className="text-muted-foreground text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Module 5: Money Guide */}
      <section id="money-guide" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['cscMoneyGuide']} locale={locale}>
                {t.modules.cscMoneyGuide.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscMoneyGuide.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.cscMoneyGuide.items.map((item: any, index: number) => {
              const moneyIcons = [ClipboardCheck, Search, ShoppingBag, Key, Package, Map]
              const MoneyIcon = moneyIcons[index % moneyIcons.length]
              return (
                <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] flex items-center justify-center flex-shrink-0">
                      <MoneyIcon className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                    </div>
                    <h3 className="font-bold text-[hsl(var(--nav-theme-light))]">{item.title}</h3>
                  </div>
                  <p className="text-muted-foreground text-sm mb-3">{item.description}</p>
                  <p className="text-xs text-muted-foreground/70 italic border-l-2 border-[hsl(var(--nav-theme)/0.3)] pl-3">{item.tip}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Module 6: Perfect Score Guide */}
      <section id="perfect-score" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['cscPerfectScore']} locale={locale}>
                {t.modules.cscPerfectScore.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscPerfectScore.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4">
            {t.modules.cscPerfectScore.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-[hsl(var(--nav-theme-light))]">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 7: Achievements Guide */}
      <section id="achievements" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold">
                <LinkedTitle linkData={moduleLinkMap['cscAchievements']} locale={locale}>
                  {t.modules.cscAchievements.title}
                </LinkedTitle>
              </h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscAchievements.intro}</p>
          </div>
          <div className="scroll-reveal overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-white/5">
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">Achievement</th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))]">Requirement</th>
                  <th className="text-left p-4 font-semibold text-[hsl(var(--nav-theme-light))] hidden md:table-cell">Chapter</th>
                  <th className="text-right p-4 font-semibold text-[hsl(var(--nav-theme-light))]">Global</th>
                </tr>
              </thead>
              <tbody>
                {t.modules.cscAchievements.items.map((item: any, index: number) => (
                  <tr key={index} className="border-b border-border/50 hover:bg-white/5 transition-colors">
                    <td className="p-4 font-semibold">{item.name}</td>
                    <td className="p-4 text-muted-foreground">{item.requirement}</td>
                    <td className="p-4 hidden md:table-cell">
                      <span className="px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-xs whitespace-nowrap">{item.chapter}</span>
                    </td>
                    <td className="p-4 text-right font-semibold text-[hsl(var(--nav-theme-light))]">{item.rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Module 8: Secrets Guide */}
      <section id="secrets" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <LinkedTitle linkData={moduleLinkMap['cscSecrets']} locale={locale}>
                {t.modules.cscSecrets.title}
              </LinkedTitle>
            </h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscSecrets.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.cscSecrets.sections.map((sec: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setSecretsExpanded(secretsExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <Key className="w-5 h-5 text-[hsl(var(--nav-theme-light))] flex-shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-semibold">{sec.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{sec.summary}</p>
                    </div>
                  </div>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 ml-3 transition-transform ${secretsExpanded === index ? 'rotate-180' : ''}`} />
                </button>
                {secretsExpanded === index && (
                  <div className="px-5 pb-5 space-y-2">
                    {sec.details.map((detail: string, di: number) => (
                      <div key={di} className="flex items-start gap-2">
                        <ArrowRight className="w-4 h-4 text-[hsl(var(--nav-theme-light))] mt-1 flex-shrink-0" />
                        <p className="text-muted-foreground text-sm">{detail}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 广告位 6: 移动端横幅 320×50 */}
      <AdBanner type="banner-320x50" adKey={process.env.NEXT_PUBLIC_AD_MOBILE_320X50} />

      {/* Module 9: Farming and Growth */}
      <section id="cassette-tapes" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscCassetteTapes']} locale={locale}>{t.modules.cscCassetteTapes.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscCassetteTapes.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {t.modules.cscCassetteTapes.sections.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`cscCassetteTapes::sections::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="scroll-reveal flex flex-wrap gap-3 justify-center">
            {t.modules.cscCassetteTapes.growthMilestones.map((m: string, i: number) => (
              <span key={i} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm">
                <Check className="w-4 h-4 text-[hsl(var(--nav-theme-light))]" />{m}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Module 10: Best Early Unlocks */}
      <section id="bodies-evidence" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscBodiesEvidence']} locale={locale}>{t.modules.cscBodiesEvidence.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscBodiesEvidence.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {t.modules.cscBodiesEvidence.priorities.map((p: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <span className={`text-xs px-2 py-1 rounded-full border ${p.priority === "Essential" ? "bg-red-500/10 border-red-500/30 text-red-400" : p.priority === "Very High" ? "bg-orange-500/10 border-orange-500/30 text-orange-400" : "bg-[hsl(var(--nav-theme)/0.1)] border-[hsl(var(--nav-theme)/0.3)]"}`}>{p.priority}</span>
                </div>
                <h3 className="font-bold mb-2">
                  <LinkedTitle linkData={moduleLinkMap[`cscBodiesEvidence::priorities::${index}`]} locale={locale}>
                    {p.name}
                  </LinkedTitle>
                </h3>
                <p className="text-muted-foreground text-sm">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 11: Achievement Tracker */}
      <section id="true-cleaner" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscTrueCleaner']} locale={locale}>{t.modules.cscTrueCleaner.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscTrueCleaner.intro}</p>
          </div>
          <div className="scroll-reveal space-y-6">
            {t.modules.cscTrueCleaner.groups.map((group: any, gi: number) => (
              <div key={gi} className="p-6 bg-white/5 border border-border rounded-xl">
                <div className="flex items-center gap-2 mb-4">
                  <ClipboardCheck className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold text-lg">
                    <LinkedTitle linkData={moduleLinkMap[`cscTrueCleaner::groups::${gi}`]} locale={locale}>
                      {group.name}
                    </LinkedTitle>
                  </h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {group.achievements.map((a: any, ai: number) => (
                    <div key={ai} className="p-3 bg-white/5 border border-border rounded-lg">
                      <p className="font-semibold text-sm text-[hsl(var(--nav-theme-light))]">{a.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{a.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 12: Singleplayer FAQ */}
      <section id="nightmare-mode" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscNightmareMode']} locale={locale}>{t.modules.cscNightmareMode.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscNightmareMode.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.cscNightmareMode.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setFaqExpanded(faqExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${faqExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {faqExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 13: Steam Deck and Controller */}
      <section id="act2-walkthrough" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Clock className="w-8 h-8 text-[hsl(var(--nav-theme-light))]" />
              <h2 className="text-4xl md:text-5xl font-bold"><LinkedTitle linkData={moduleLinkMap['cscAct2Walkthrough']} locale={locale}>{t.modules.cscAct2Walkthrough.title}</LinkedTitle></h2>
            </div>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscAct2Walkthrough.intro}</p>
          </div>
          <div className="scroll-reveal space-y-2">
            {t.modules.cscAct2Walkthrough.faqs.map((faq: any, index: number) => (
              <div key={index} className="border border-border rounded-xl overflow-hidden">
                <button
                  onClick={() => setDeckExpanded(deckExpanded === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-semibold">{faq.question}</span>
                  <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform ${deckExpanded === index ? "rotate-180" : ""}`} />
                </button>
                {deckExpanded === index && (
                  <div className="px-5 pb-5 text-muted-foreground text-sm">{faq.answer}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 14: Settings and Accessibility */}
      <section id="act2-secrets" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscAct2Secrets']} locale={locale}>{t.modules.cscAct2Secrets.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscAct2Secrets.intro}</p>
          </div>
          <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 gap-4">
            {t.modules.cscAct2Secrets.settings.map((s: any, index: number) => (
              <div key={index} className="p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex items-center gap-3 mb-3">
                  <Settings className="w-5 h-5 text-[hsl(var(--nav-theme-light))]" />
                  <h3 className="font-bold">
                    <LinkedTitle linkData={moduleLinkMap[`cscAct2Secrets::settings::${index}`]} locale={locale}>
                      {s.name}
                    </LinkedTitle>
                  </h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{s.type}</span>
                </div>
                <p className="text-muted-foreground text-sm">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 15: Updates and Patch Notes */}
      <section id="detergents" className="scroll-mt-24 px-4 py-20">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscDetergents']} locale={locale}>{t.modules.cscDetergents.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscDetergents.intro}</p>
          </div>
          <div className="scroll-reveal relative pl-6 border-l-2 border-[hsl(var(--nav-theme)/0.3)] space-y-8">
            {t.modules.cscDetergents.entries.map((entry: any, index: number) => (
              <div key={index} className="relative">
                <div className="absolute -left-[1.4rem] w-4 h-4 rounded-full bg-[hsl(var(--nav-theme))] border-2 border-background" />
                <div className="p-5 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)]">{entry.type}</span>
                    <Clock className="w-4 h-4 text-muted-foreground" />
                  </div>
                  <h3 className="font-bold mb-1">
                    <LinkedTitle linkData={moduleLinkMap[`cscDetergents::entries::${index}`]} locale={locale}>
                      {entry.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground text-sm">{entry.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Module 16: Crash Fix and Troubleshooting */}
      <section id="system-info" className="scroll-mt-24 px-4 py-20 bg-white/[0.02]">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 scroll-reveal">
            <h2 className="text-4xl md:text-5xl font-bold mb-4"><LinkedTitle linkData={moduleLinkMap['cscSystemInfo']} locale={locale}>{t.modules.cscSystemInfo.title}</LinkedTitle></h2>
            <p className="text-muted-foreground text-lg max-w-3xl mx-auto">{t.modules.cscSystemInfo.intro}</p>
          </div>
          <div className="scroll-reveal space-y-4 mb-8">
            {t.modules.cscSystemInfo.steps.map((step: any, index: number) => (
              <div key={index} className="flex gap-4 p-6 bg-white/5 border border-border rounded-xl hover:border-[hsl(var(--nav-theme)/0.5)] transition-colors">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-[hsl(var(--nav-theme)/0.2)] border-2 border-[hsl(var(--nav-theme)/0.5)] flex items-center justify-center">
                  <span className="text-xl font-bold text-[hsl(var(--nav-theme-light))]">{index + 1}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    <LinkedTitle linkData={moduleLinkMap[`cscSystemInfo::steps::${index}`]} locale={locale}>
                      {step.title}
                    </LinkedTitle>
                  </h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="scroll-reveal p-6 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-yellow-400 mb-2">Still having issues?</h3>
                <p className="text-sm text-muted-foreground mb-3">Report bugs with your logs through the official channels:</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://discord.com/invite/EjHuxvM" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    <MessageCircle className="w-4 h-4" /> Discord <ExternalLink className="w-3 h-3" />
                  </a>
                  <a href="https://store.steampowered.com/app/1040200/Crime_Scene_Cleaner/" target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--nav-theme)/0.1)] border border-[hsl(var(--nav-theme)/0.3)] text-sm hover:bg-[hsl(var(--nav-theme)/0.2)] transition-colors">
                    Steam Community <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <FAQSection
          title={t.faq.title}
          titleHighlight={t.faq.titleHighlight}
          subtitle={t.faq.subtitle}
          questions={t.faq.questions}
        />
      </Suspense>

      {/* CTA Section */}
      <Suspense fallback={<LoadingPlaceholder />}>
        <CTASection
          title={t.cta.title}
          description={t.cta.description}
          joinCommunity={t.cta.joinCommunity}
          joinGame={t.cta.joinGame}
        />
      </Suspense>

      {/* Ad Banner 3 */}
      <AdBanner type="banner-728x90" adKey={process.env.NEXT_PUBLIC_AD_BANNER_728X90} />

      {/* Footer */}
      <footer className="bg-white/[0.02] border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Brand */}
            <div>
              <h3 className="text-xl font-bold mb-4 text-[hsl(var(--nav-theme-light))]">
                {t.footer.title}
              </h3>
              <p className="text-sm text-muted-foreground">{t.footer.description}</p>
            </div>

            {/* Community - External Links Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.community}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a
                    href="https://discord.com/invite/EjHuxvM"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.discord}
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Pres_Studio"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.twitter}
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.reddit.com/r/CrimeSceneCleanerGame/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.reddit}
                  </a>
                </li>
                <li>
                  <a
                    href="https://steamcommunity.com/app/1040200"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamCommunity}
                  </a>
                </li>
                <li>
                  <a
                    href="https://store.steampowered.com/app/1040200/Crime_Scene_Cleaner/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.steamStore}
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal - Internal Routes Only */}
            <div>
              <h4 className="font-semibold mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.about}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy-policy"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.privacy}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms-of-service"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.terms}
                  </Link>
                </li>
                <li>
                  <Link
                    href="/copyright"
                    className="text-muted-foreground hover:text-[hsl(var(--nav-theme-light))] transition"
                  >
                    {t.footer.copyrightNotice}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Copyright */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">{t.footer.copyright}</p>
              <p className="text-xs text-muted-foreground">{t.footer.disclaimer}</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
