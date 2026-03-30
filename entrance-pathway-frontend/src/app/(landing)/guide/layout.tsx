import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Study Guide - IT Entrance Exam Preparation Guide',
  description:
    'Complete guide to preparing for IT entrance exams in Nepal. Study plans, syllabus breakdown, and preparation strategies for BIT, BCA, BSc CSIT, and BIM.',
  alternates: { canonical: '/guide' },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
