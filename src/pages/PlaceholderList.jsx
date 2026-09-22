import React from 'react'
import { PlusCircle } from 'lucide-react'
import Layout from '../components/layout/Layout'
import PageHeader from '../components/common/PageHeader'
import { Card } from '../components/common/Card'
import Button from '../components/common/Button'
import { useApp } from '../context/AppContext'

export default function PlaceholderList({ code, title, subtitle }) {
  const { pushToast } = useApp()
  return (
    <Layout title={title} subtitle={subtitle}>
      <PageHeader
        code={code}
        title={title}
        subtitle={subtitle}
        actions={<Button variant="primary" icon={PlusCircle} size="sm" onClick={() => pushToast('नया रिकॉर्ड जोड़ने का फॉर्म खुलेगा', 'info')}>नया जोड़ें</Button>}
      />
      <Card className="p-10 flex flex-col items-center text-center gap-2">
        <p className="text-slate-500 text-sm">अभी तक कोई रिकॉर्ड नहीं है। शुरू करने के लिए ऊपर "नया जोड़ें" पर क्लिक करें।</p>
      </Card>
    </Layout>
  )
}
