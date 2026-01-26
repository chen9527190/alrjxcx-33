// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Badge, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';
// @ts-ignore;
import { Eye, Heart, Download, Star, Clock } from 'lucide-react';

// 资源卡片组件
function ResourceCard({
  resource,
  onLike,
  onDownload
}) {
  return <Card className="hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="p-0">
        <img src={resource.cover} alt={resource.title} className="w-full h-48 object-cover rounded-t-lg" />
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg mb-2 line-clamp-2">{resource.title}</CardTitle>
        <CardDescription className="text-sm mb-3 line-clamp-2">
          {resource.description}
        </CardDescription>
        <div className="flex flex-wrap gap-1 mb-3">
          {resource.tags.map((tag, index) => <Badge key={index} variant="outline" className="text-xs">
              {tag}
            </Badge>)}
        </div>
        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {resource.views}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-4 h-4" />
              {resource.likes}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={() => onDownload(resource)} className="w-full bg-red-600 hover:bg-red-700">
          <Download className="w-4 h-4 mr-2" />
          获取资源
        </Button>
        <Button variant="ghost" size="sm" onClick={() => onLike(resource.id)} className="ml-2">
          <Heart className="w-4 h-4" />
        </Button>
      </CardFooter>
    </Card>;
}
export default function Home(props) {
  const {
    toast
  } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('daily');
  const [resources, setResources] = useState([]);
  const [tags, setTags] = useState(['软件工具', '网站资源', '课程教程', '设计素材', '办公效率']);

  // 模拟资源数据
  const mockResources = [{
    id: 1,
    title: 'Photoshop 2024 最新版安装包',
    description: 'Adobe Photoshop 2024 官方正版安装包，包含激活工具',
    cover: 'https://images.unsplash.com/photo-1611605698335-8b1569810432?w=400&h=200&fit=crop',
    views: 1250,
    likes: 89,
    tags: ['软件工具', '设计'],
    type: 'daily'
  }, {
    id: 2,
    title: '前端开发全套视频教程',
    description: '从零开始学习前端开发，包含HTML、CSS、JavaScript、React等',
    cover: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=200&fit=crop',
    views: 890,
    likes: 67,
    tags: ['课程教程', '编程'],
    type: 'hot'
  }, {
    id: 3,
    title: '免费商用字体合集',
    description: '100+款可商用的免费字体打包下载',
    cover: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=200&fit=crop',
    views: 2100,
    likes: 156,
    tags: ['设计素材', '字体'],
    type: 'latest'
  }];
  useEffect(() => {
    setResources(mockResources);
  }, []);
  const handleSearch = () => {
    if (searchQuery.trim()) {
      toast({
        title: '搜索功能',
        description: `正在搜索: ${searchQuery}`
      });
    }
  };
  const handleLike = resourceId => {
    setResources(resources.map(resource => resource.id === resourceId ? {
      ...resource,
      likes: resource.likes + 1
    } : resource));
    toast({
      title: '点赞成功',
      description: '感谢您的支持！'
    });
  };
  const handleDownload = resource => {
    toast({
      title: '资源获取',
      description: '正在处理您的请求...'
    });

    // 模拟广告播放流程
    setTimeout(() => {
      toast({
        title: '广告播放完成',
        description: `资源链接已解锁: ${resource.title}`,
        variant: 'success'
      });
    }, 2000);
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">阿良资源库</h1>
            <div className="flex-1 max-w-md mx-4">
              <div className="relative">
                <Input type="text" placeholder="搜索资源标题、内容、标签..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSearch()} className="pl-10 pr-4 py-2" />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>
            </div>
            <Button variant="ghost" onClick={() => props.$w.utils.navigateTo({
            pageId: 'profile',
            params: {}
          })} className="text-gray-600 hover:text-gray-900">
              我的
            </Button>
          </div>
        </div>
      </header>

      {/* 标签筛选 */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex space-x-2 overflow-x-auto">
            {tags.map((tag, index) => <Badge key={index} variant="secondary" className="px-3 py-1 text-sm cursor-pointer hover:bg-gray-100 whitespace-nowrap">
                {tag}
              </Badge>)}
          </div>
        </div>
      </div>

      {/* 主要内容区 */}
      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              每日推荐
            </TabsTrigger>
            <TabsTrigger value="hot" className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              热门推荐
            </TabsTrigger>
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              最新发布
            </TabsTrigger>
          </TabsList>

          {/* 每日推荐 */}
          <TabsContent value="daily" className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">今日精选资源</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {resources.filter(r => r.type === 'daily').map(resource => <ResourceCard key={resource.id} resource={resource} onLike={handleLike} onDownload={handleDownload} />)}
              </div>
            </div>
          </TabsContent>

          {/* 热门推荐 */}
          <TabsContent value="hot" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.filter(r => r.type === 'hot').map(resource => <ResourceCard key={resource.id} resource={resource} onLike={handleLike} onDownload={handleDownload} />)}
            </div>
          </TabsContent>

          {/* 最新发布 */}
          <TabsContent value="latest" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {resources.filter(r => r.type === 'latest').map(resource => <ResourceCard key={resource.id} resource={resource} onLike={handleLike} onDownload={handleDownload} />)}
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}