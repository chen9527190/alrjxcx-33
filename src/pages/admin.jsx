// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Textarea, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Switch, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';
// @ts-ignore;
import { Plus, Edit, Trash2, Eye, Download, Users, Settings, BarChart3, Key, Bell, X, Image, Link, Tag, Folder } from 'lucide-react';

export default function Admin(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('content');

  // 模拟数据
  const [articles, setArticles] = useState([{
    id: 1,
    title: 'Photoshop 2024 安装包',
    content: '包含最新版本的Photoshop安装包和破解教程...',
    coverImage: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400',
    views: 1250,
    realViews: 890,
    likes: 89,
    status: 'published',
    isDaily: true,
    tags: ['设计', '工具'],
    category: '软件资源',
    cloudLinks: [{
      name: '百度网盘',
      url: 'https://pan.baidu.com/s/xxx',
      password: '1234'
    }, {
      name: '阿里云盘',
      url: 'https://www.aliyundrive.com/s/xxx',
      password: ''
    }]
  }, {
    id: 2,
    title: '前端开发教程',
    content: '从零开始学习前端开发...',
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
    views: 890,
    realViews: 567,
    likes: 67,
    status: 'published',
    isDaily: false,
    tags: ['前端', '教程'],
    category: '学习资料',
    cloudLinks: []
  }, {
    id: 3,
    title: '免费字体合集',
    content: '精选免费商用字体合集...',
    coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400',
    views: 2100,
    realViews: 1234,
    likes: 156,
    status: 'draft',
    isDaily: false,
    tags: ['设计', '字体'],
    category: '设计资源',
    cloudLinks: []
  }]);

  // 新文章表单数据
  const [newArticle, setNewArticle] = useState({
    title: '',
    content: '',
    coverImage: '',
    status: 'draft',
    tags: [],
    category: '',
    cloudLinks: [{
      name: '',
      url: '',
      password: ''
    }]
  });

  // 编辑文章数据
  const [editingArticle, setEditingArticle] = useState(null);

  // 标签和分类管理
  const [categories, setCategories] = useState(['软件资源', '学习资料', '设计资源', '工具插件', '模板素材']);
  const [tags, setTags] = useState(['前端', '设计', '工具', '教程', '免费', '资源', '软件', '字体', '插件']);
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');

  // 标签分类管理面板状态
  const [showTagPanel, setShowTagPanel] = useState(false);

  // 编辑状态
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingTag, setEditingTag] = useState(null);

  // 图片和链接管理
  const [imageUrls, setImageUrls] = useState(['']);
  const [textLinks, setTextLinks] = useState([{ name: '', url: '' }]);

  // 发布新文章
  const handlePublishArticle = () => {
    if (!newArticle.title.trim()) {
      toast({
        title: '发布失败',
        description: '请输入文章标题',
        variant: 'destructive'
      });
      return;
    }
    if (!newArticle.content.trim()) {
      toast({
        title: '发布失败',
        description: '请输入文章内容',
        variant: 'destructive'
      });
      return;
    }

    // 过滤有效的网盘链接
    const validCloudLinks = newArticle.cloudLinks.filter(link => link.name.trim() && link.url.trim());
    if (editingArticle) {
      // 编辑文章
      setArticles(prev => prev.map(article => article.id === editingArticle.id ? {
        ...newArticle,
        id: editingArticle.id,
        views: editingArticle.views,
        realViews: editingArticle.realViews,
        likes: editingArticle.likes,
        cloudLinks: validCloudLinks
      } : article));
      setEditingArticle(null);
      toast({
        title: '编辑成功',
        description: '文章已更新',
        variant: 'default'
      });
    } else {
      // 发布新文章
      const newArticleData = {
        id: articles.length + 1,
        title: newArticle.title,
        content: newArticle.content,
        coverImage: newArticle.coverImage,
        views: 0,
        realViews: 0,
        likes: 0,
        status: newArticle.status,
        isDaily: false,
        tags: newArticle.tags,
        category: newArticle.category,
        cloudLinks: validCloudLinks,
        createTime: new Date().toISOString().split('T')[0]
      };
      setArticles([...articles, newArticleData]);
      toast({
        title: '发布成功',
        description: '新文章已发布',
        variant: 'default'
      });
    }

    // 重置表单
    setNewArticle({
      title: '',
      content: '',
      coverImage: '',
      status: 'draft',
      tags: [],
      category: '',
      cloudLinks: [{
        name: '',
        url: '',
        password: ''
      }]
    });
  };

  // 编辑文章
  const handleEditArticle = article => {
    setEditingArticle(article);
    setNewArticle({
      title: article.title,
      content: article.content || '',
      coverImage: article.coverImage || '',
      status: article.status,
      tags: article.tags || [],
      category: article.category || '',
      cloudLinks: article.cloudLinks && article.cloudLinks.length > 0 ? article.cloudLinks : [{
        name: '',
        url: '',
        password: ''
      }]
    });
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingArticle(null);
    setNewArticle({
      title: '',
      content: '',
      coverImage: '',
      status: 'draft',
      tags: [],
      category: '',
      cloudLinks: [{
        name: '',
        url: '',
        password: ''
      }]
    });
  };

  // 添加网盘链接
  const addCloudLink = () => {
    setNewArticle(prev => ({
      ...prev,
      cloudLinks: [...prev.cloudLinks, {
        name: '',
        url: '',
        password: ''
      }]
    }));
  };

  // 删除网盘链接
  const removeCloudLink = index => {
    setNewArticle(prev => ({
      ...prev,
      cloudLinks: prev.cloudLinks.filter((_, i) => i !== index)
    }));
  };

  // 更新网盘链接
  const updateCloudLink = (index, field, value) => {
    setNewArticle(prev => ({
      ...prev,
      cloudLinks: prev.cloudLinks.map((link, i) => i === index ? {
        ...link,
        [field]: value
      } : link)
    }));
  };

  // 添加分类
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
      toast({
        title: '添加成功',
        description: '新分类已添加',
        variant: 'default'
      });
    }
  };

  // 编辑分类
  const editCategory = (oldCategory, newCategory) => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => prev.map(c => c === oldCategory ? newCategory.trim() : c));
      setEditingCategory(null);
      toast({
        title: '修改成功',
        description: '分类已更新',
        variant: 'default'
      });
    }
  };

  // 删除分类
  const removeCategory = (category) => {
    // 检查是否有文章使用该分类
    const articlesUsingCategory = articles.filter(article => article.category === category);
    if (articlesUsingCategory.length > 0) {
      toast({
        title: '删除失败',
        description: `有 ${articlesUsingCategory.length} 篇文章使用此分类，请先修改文章分类`, 
        variant: 'destructive'
      });
      return;
    }
    
    setCategories(prev => prev.filter(c => c !== category));
    toast({
      title: '删除成功',
      description: '分类已删除',
      variant: 'default'
    });
  };

  // 添加图片URL
  const addImageUrl = () => {
    setImageUrls(prev => [...prev, '']);
  };

  // 更新图片URL
  const updateImageUrl = (index, value) => {
    setImageUrls(prev => prev.map((url, i) => i === index ? value : url));
  };

  // 删除图片URL
  const removeImageUrl = index => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // 插入图片到内容
  const insertImageToContent = imageUrl => {
    if (imageUrl.trim()) {
      const imageMarkdown = `\n![图片](${imageUrl})\n`;
      setNewArticle(prev => ({
        ...prev,
        content: prev.content + imageMarkdown
      }));
      toast({
        title: '插入成功',
        description: '图片已插入到内容中',
        variant: 'default'
      });
    }
  };

  // 添加文字链接
  const addTextLink = () => {
    setTextLinks(prev => [...prev, {
      name: '',
      url: ''
    }]);
  };

  // 更新文字链接
  const updateTextLink = (index, field, value) => {
    setTextLinks(prev => prev.map((link, i) => i === index ? {
      ...link,
      [field]: value
    } : link));
  };

  // 删除文字链接
  const removeTextLink = index => {
    setTextLinks(prev => prev.filter((_, i) => i !== index));
  };

  // 插入链接到内容
  const insertLinkToContent = link => {
    if (link.name.trim() && link.url.trim()) {
      const linkMarkdown = `[${link.name}](${link.url})`;
      setNewArticle(prev => ({
        ...prev,
        content: prev.content + linkMarkdown
      }));
      toast({
        title: '插入成功',
        description: '链接已插入到内容中',
        variant: 'default'
      });
    }
  };

  // 删除标签
  const removeTag = (tag) => {
    // 检查是否有文章使用该标签
    const articlesUsingTag = articles.filter(article => article.tags?.includes(tag));
    if (articlesUsingTag.length > 0) {
      toast({
        title: '删除失败',
        description: `有 ${articlesUsingTag.length} 篇文章使用此标签，请先修改文章标签`, 
        variant: 'destructive'
      });
      return;
    }
    
    setTags(prev => prev.filter(t => t !== tag));
    toast({
      title: '删除成功',
      description: '标签已删除',
      variant: 'default'
    });
  };

  // 添加标签
  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
      toast({
        title: '添加成功',
        description: '新标签已添加',
        variant: 'default'
      });
    }
  };

  // 编辑标签
  const editTag = (oldTag, newTag) => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => prev.map(t => t === oldTag ? newTag.trim() : t));
      // 更新所有使用该标签的文章
      setArticles(prev => prev.map(article => ({
        ...article,
        tags: article.tags?.map(t => t === oldTag ? newTag.trim() : t) || []
      })));
      setEditingTag(null);
      toast({
        title: '修改成功',
        description: '标签已更新',
        variant: 'default'
      });
    }
  };

  // 删除标签
  const removeTag = (tag) => {
    // 检查是否有文章使用该标签
    const articlesUsingTag = articles.filter(article => article.tags?.includes(tag));
    if (articlesUsingTag.length > 0) {
      toast({
        title: '删除失败',
        description: `有 ${articlesUsingTag.length} 篇文章使用此标签，请先修改文章标签`, 
        variant: 'destructive'
      });
      return;
    }
    
    setTags(prev => prev.filter(t => t !== tag));
    toast({
      title: '删除成功',
      description: '标签已删除',
      variant: 'default'
    });
  };

  // 删除标签


  // 选择标签
  const toggleTag = tag => {
    setNewArticle(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter(t => t !== tag) : [...prev.tags, tag]
    }));
  };

  // 保存编辑
  const handleSaveEdit = () => {
    if (!editingArticle) return;
    if (!newArticle.title.trim()) {
      toast({
        title: '保存失败',
        description: '请输入文章标题',
        variant: 'destructive'
      });
      return;
    }
    setArticles(articles.map(article => article.id === editingArticle.id ? {
      ...article,
      title: newArticle.title,
      content: newArticle.content,
      status: newArticle.status
    } : article));
    setEditingArticle(null);
    setNewArticle({
      title: '',
      content: '',
      status: 'draft'
    });
    toast({
      title: '保存成功',
      description: '文章已更新',
      variant: 'default'
    });
  };

  // 删除文章
  const handleDeleteArticle = articleId => {
    setArticles(articles.filter(article => article.id !== articleId));
    toast({
      title: '删除成功',
      description: '文章已删除',
      variant: 'default'
    });
  };
  const [adSettings, setAdSettings] = useState({
    globalEnabled: true,
    splash: {
      enabled: true,
      source: 'tencent',
      adId: ''
    },
    reward: {
      enabled: true,
      source: 'tencent',
      adId: ''
    },
    banner: {
      enabled: true,
      source: 'tencent',
      adId: ''
    },
    feed: {
      enabled: false,
      source: 'custom',
      adId: ''
    }
  });
  const [vipKeys, setVipKeys] = useState([{
    id: 1,
    key: 'VIP20240125001',
    duration: 30,
    status: 'active',
    user: '用户A',
    activateTime: '2024-01-25'
  }, {
    id: 2,
    key: 'VIP20240125002',
    duration: 90,
    status: 'inactive',
    user: null,
    activateTime: null
  }, {
    id: 3,
    key: 'VIP20240125003',
    duration: 365,
    status: 'inactive',
    user: null,
    activateTime: null
  }]);
  const handleToggleAd = adType => {
    setAdSettings(prev => {
      if (!prev || !prev[adType]) {
        toast({
          title: '操作失败',
          description: '广告设置数据异常',
          variant: 'destructive'
        });
        return prev;
      }
      const newSettings = {
        ...prev,
        [adType]: {
          ...prev[adType],
          enabled: !prev[adType].enabled
        }
      };

      // 直接使用计算的状态值，避免异步问题
      const isEnabled = !prev[adType].enabled;
      const status = isEnabled ? '已开启' : '已关闭';
      toast({
        title: '设置已更新',
        description: `${adType}广告${status}`
      });
      return newSettings;
    });
  };
  const [keyGeneration, setKeyGeneration] = useState({
    cardType: 'monthly',
    quantity: 1
  });
  const handleGenerateKeys = () => {
    const {
      cardType,
      quantity
    } = keyGeneration;

    // 根据卡密类型设置时长
    const durationMap = {
      monthly: 30,
      quarterly: 90,
      halfyear: 180,
      yearly: 365
    };
    const duration = durationMap[cardType] || 30;

    // 验证输入参数
    if (!quantity || quantity <= 0) {
      toast({
        title: '参数错误',
        description: '数量必须大于0',
        variant: 'destructive'
      });
      return;
    }

    // 验证数量范围
    if (quantity > 100) {
      toast({
        title: '参数错误',
        description: '单次生成数量不能超过100张',
        variant: 'destructive'
      });
      return;
    }
    const newKeys = Array.from({
      length: quantity
    }, (_, index) => ({
      id: vipKeys.length + index + 1,
      key: `VIP${new Date().getTime()}${vipKeys.length + index + 1}`,
      duration: duration,
      cardType: cardType,
      status: 'inactive',
      user: null,
      activateTime: null
    }));
    setVipKeys([...vipKeys, ...newKeys]);
    toast({
      title: '生成成功',
      description: `已生成 ${quantity} 张 ${cardType === 'monthly' ? '月卡' : cardType === 'quarterly' ? '季度卡' : cardType === 'halfyear' ? '半年卡' : '年卡'}（${duration}天）`
    });
  };

  // 删除卡密
  const handleDeleteKey = keyId => {
    setVipKeys(vipKeys.filter(key => key.id !== keyId));
    toast({
      title: '删除成功',
      description: '卡密已删除'
    });
  };

  // 禁用/启用卡密
  const handleToggleKeyStatus = keyId => {
    setVipKeys(vipKeys.map(key => key.id === keyId ? {
      ...key,
      status: key.status === 'inactive' ? 'disabled' : 'inactive'
    } : key));
    toast({
      title: '状态更新成功',
      description: '卡密状态已更新'
    });
  };
  const handleSetDaily = articleId => {
    setArticles(articles.map(article => article.id === articleId ? {
      ...article,
      isDaily: !article.isDaily
    } : article));
    toast({
      title: '设置成功',
      description: '每日推荐已更新'
    });
  };
  return <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">管理后台</h1>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => props.$w.utils.navigateTo({
              pageId: 'home',
              params: {}
            })}>
                返回前台
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              内容管理
            </TabsTrigger>
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              广告管理
            </TabsTrigger>
            <TabsTrigger value="vip" className="flex items-center gap-2">
              <Key className="w-4 h-4" />
              会员管理
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              数据看板
            </TabsTrigger>
          </TabsList>

          {/* 内容管理 */}
          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>文章管理</CardTitle>
                    <CardDescription>管理所有发布的资源文章</CardDescription>
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    发布新文章
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 发布/编辑文章表单 */}
                  <div className="p-6 border rounded-lg bg-white shadow-sm">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Edit className="w-5 h-5" />
                      {editingArticle ? '编辑文章' : '发布新文章'}
                    </h3>
                    <div className="space-y-6">
                      {/* 基础信息 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="title" className="mb-2 block">文章标题</Label>
                          <Input id="title" placeholder="请输入文章标题" value={newArticle.title} onChange={e => setNewArticle({
                          ...newArticle,
                          title: e.target.value
                        })} />
                        </div>
                        <div>
                          <Label htmlFor="category" className="mb-2 block">文章分类</Label>
                          <Select value={newArticle.category} onValueChange={value => setNewArticle({
                          ...newArticle,
                          category: value
                        })}>
                            <SelectTrigger>
                              <SelectValue placeholder="选择分类" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* 封面图片 */}
                      <div>
                        <Label className="mb-2 block flex items-center gap-2">
                          <Image className="w-4 h-4" />
                          封面图片
                        </Label>
                        <div className="flex gap-4">
                          <Input placeholder="封面图片URL" value={newArticle.coverImage} onChange={e => setNewArticle({
                          ...newArticle,
                          coverImage: e.target.value
                        })} className="flex-1" />
                          {newArticle.coverImage && <div className="w-16 h-16 border rounded overflow-hidden">
                              <img src={newArticle.coverImage} alt="封面预览" className="w-full h-full object-cover" />
                            </div>}
                        </div>
                      </div>

                      {/* 文章内容 */}
                      <div>
                        <Label htmlFor="content" className="mb-2 block">文章内容</Label>
                        <Textarea id="content" placeholder="请输入文章内容，支持图文混排..." rows={8} value={newArticle.content} onChange={e => setNewArticle({
                        ...newArticle,
                        content: e.target.value
                      })} />
                      </div>

                      {/* 标签选择 */}
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <Label className="flex items-center gap-2">
                            <Tag className="w-4 h-4" />
                            文章标签
                          </Label>
                          <Button variant="outline" size="sm" onClick={() => setShowTagPanel(!showTagPanel)}>
                            管理标签
                          </Button>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newArticle.tags.map(tag => <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <X className="w-3 h-3 cursor-pointer" onClick={() => toggleTag(tag)} />
                            </Badge>)}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {tags.filter(tag => !newArticle.tags.includes(tag)).map(tag => <Badge key={tag} variant="outline" className="cursor-pointer" onClick={() => toggleTag(tag)}>
                              {tag}
                            </Badge>)}
                        </div>
                      </div>

                      {/* 网盘链接管理 */}
                      <div>
                        <Label className="mb-2 block flex items-center gap-2">
                          <Link className="w-4 h-4" />
                          网盘链接
                        </Label>
                        <div className="space-y-3">
                          {newArticle.cloudLinks.map((link, index) => <div key={index} className="flex gap-2 items-start">
                              <Input placeholder="链接名称（如：百度网盘）" value={link.name} onChange={e => updateCloudLink(index, 'name', e.target.value)} className="flex-1" />
                              <Input placeholder="链接URL" value={link.url} onChange={e => updateCloudLink(index, 'url', e.target.value)} className="flex-1" />
                              <Input placeholder="提取码（可选）" value={link.password} onChange={e => updateCloudLink(index, 'password', e.target.value)} className="w-32" />
                              <Button variant="outline" size="sm" onClick={() => removeCloudLink(index)} disabled={newArticle.cloudLinks.length === 1}>
                                <X className="w-4 h-4" />
                              </Button>
                            </div>)}
                          <Button variant="outline" onClick={addCloudLink} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            添加网盘链接
                          </Button>
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="flex gap-2 pt-4 border-t">
                        <Button onClick={editingArticle ? handleSaveEdit : handlePublishArticle} className="bg-blue-600 hover:bg-blue-700">
                          {editingArticle ? '保存修改' : '发布文章'}
                        </Button>
                        <Button variant="outline" onClick={() => {
                        const articleData = {
                          ...newArticle,
                          status: 'draft'
                        };
                        if (editingArticle) {
                          setArticles(prev => prev.map(article => article.id === editingArticle.id ? {
                            ...articleData,
                            id: editingArticle.id
                          } : article));
                          setEditingArticle(null);
                          toast({
                            title: '保存成功',
                            description: '草稿已保存',
                            variant: 'default'
                          });
                        } else {
                          const newArticleData = {
                            ...articleData,
                            id: articles.length + 1,
                            views: 0,
                            realViews: 0,
                            likes: 0,
                            isDaily: false,
                            createTime: new Date().toISOString().split('T')[0]
                          };
                          setArticles([...articles, newArticleData]);
                          toast({
                            title: '保存成功',
                            description: '草稿已保存',
                            variant: 'default'
                          });
                        }
                        setNewArticle({
                          title: '',
                          content: '',
                          coverImage: '',
                          status: 'draft',
                          tags: [],
                          category: '',
                          cloudLinks: [{
                            name: '',
                            url: '',
                            password: ''
                          }]
                        });
                      }}>
                          存为草稿
                        </Button>
                        {editingArticle && <Button variant="outline" onClick={handleCancelEdit}>
                            取消编辑
                          </Button>}
                      </div>
                    </div>
                  </div>

                  {/* 标签分类管理面板 */}
                  {showTagPanel && <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Folder className="w-5 h-5" />
                          标签与分类管理
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* 分类管理 */}
                          <div>
                            <h4 className="font-semibold mb-3">分类管理</h4>
                            <div className="flex gap-2 mb-3">
                              <Input placeholder="新分类名称" value={newCategory} onChange={e => setNewCategory(e.target.value)} />
                              <Button onClick={addCategory}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {categories.map(category => <Badge key={category} variant="secondary" className="flex items-center gap-1">
                                  {category}
                                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeCategory(category)} />
                                </Badge>)}
                            </div>
                          </div>

                          {/* 标签管理 */}
                          <div>
                            <h4 className="font-semibold mb-3">标签管理</h4>
                            <div className="flex gap-2 mb-3">
                              <Input placeholder="新标签名称" value={newTag} onChange={e => setNewTag(e.target.value)} />
                              <Button onClick={addTag}>
                                <Plus className="w-4 h-4" />
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {tags.map(tag => <Badge key={tag} variant="outline" className="flex items-center gap-1">
                                  {tag}
                                  <X className="w-3 h-3 cursor-pointer" onClick={() => removeTag(tag)} />
                                </Badge>)}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>}

                  {/* 文章列表 */}
                  <div className="space-y-4">
                    {articles.map(article => <Card key={article.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            {/* 封面图片 */}
                            {article.coverImage && <div className="w-20 h-20 flex-shrink-0 border rounded overflow-hidden">
                                <img src={article.coverImage} alt="封面" className="w-full h-full object-cover" />
                              </div>}
                            
                            {/* 文章信息 */}
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-lg">{article.title}</h3>
                                {article.isDaily && <Badge variant="default">每日推荐</Badge>}
                                <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                                  {article.status === 'published' ? '已发布' : '草稿'}
                                </Badge>
                              </div>
                              
                              {/* 标签和分类 */}
                              <div className="flex flex-wrap gap-2 mb-2">
                                {article.category && <Badge variant="outline">{article.category}</Badge>}
                                {article.tags?.map(tag => <Badge key={tag} variant="secondary">{tag}</Badge>)}
                              </div>
                              
                              {/* 网盘链接 */}
                              {article.cloudLinks && article.cloudLinks.length > 0 && <div className="flex flex-wrap gap-2 mb-2">
                                  {article.cloudLinks.map((link, index) => <Badge key={index} variant="outline" className="flex items-center gap-1">
                                      <Link className="w-3 h-3" />
                                      {link.name}
                                    </Badge>)}
                                </div>}
                              
                              {/* 数据统计 */}
                              <div className="flex space-x-4 text-sm text-gray-500">
                                <span>展示阅读: {article.views}</span>
                                <span>真实阅读: {article.realViews}</span>
                                <span>点赞: {article.likes}</span>
                                <span>创建时间: {article.createTime}</span>
                              </div>
                            </div>
                            
                            {/* 操作按钮 */}
                            <div className="flex space-x-2">
                              <Button variant={article.isDaily ? "default" : "outline"} size="sm" onClick={() => handleSetDaily(article.id)}>
                                {article.isDaily ? '取消推荐' : '设为推荐'}
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleEditArticle(article)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm" onClick={() => handleDeleteArticle(article.id)}>
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 广告管理 */}
          <TabsContent value="ads" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>广告系统配置</CardTitle>
                <CardDescription>管理全站广告显示设置</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 全局开关 */}
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <Label htmlFor="global-ad" className="text-lg font-semibold">全局广告开关</Label>
                    <p className="text-sm text-gray-500">控制全站所有广告的显示</p>
                  </div>
                  <Switch id="global-ad" checked={adSettings.globalEnabled} onCheckedChange={checked => setAdSettings(prev => ({
                  ...prev,
                  globalEnabled: checked
                }))} />
                </div>

                {/* 各广告位配置 */}
                <div className="grid gap-4 md:grid-cols-2">
                  {Object.entries(adSettings).filter(([key]) => key !== 'globalEnabled').map(([adType, config]) => <Card key={adType}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <Label htmlFor={adType} className="font-semibold capitalize">
                            {adType === 'splash' ? '开屏广告' : adType === 'reward' ? '激励视频' : adType === 'banner' ? '横幅广告' : '信息流广告'}
                          </Label>
                          <Switch id={adType} checked={config.enabled} onCheckedChange={() => handleToggleAd(adType)} disabled={!adSettings.globalEnabled} />
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-gray-600">广告源:</div>
                          <select className="w-full p-2 border rounded text-sm" value={config && config.source ? config.source : 'tencent'} onChange={e => {
                        setAdSettings(prev => ({
                          ...prev,
                          [adType]: {
                            ...prev[adType],
                            source: e.target.value,
                            adId: '' // 切换广告源时清空广告ID
                          }
                        }));
                      }} disabled={!config || !config.enabled || !adSettings || !adSettings.globalEnabled}>
                            <option value="tencent">腾讯广告</option>
                            <option value="thirdparty">第三方平台</option>
                            <option value="custom">自定义代码</option>
                          </select>
                          
                          {/* 腾讯广告配置说明 */}
                          {config.source === 'tencent' && <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                              <div className="font-medium text-blue-800 mb-1">腾讯广告配置说明</div>
                              <div className="text-blue-700 space-y-1">
                                <div>• 自动接入腾讯广告平台</div>
                                <div>• 无需手动配置广告ID</div>
                                <div>• 系统自动获取合适的广告位</div>
                                <div>• 支持开屏、激励视频、横幅广告</div>
                              </div>
                            </div>}
                          
                          {/* 第三方平台广告ID输入框 */}
                          {(config.source === 'thirdparty' || config.source === 'custom') && <div className="space-y-1">
                              <div className="text-sm text-gray-600">
                                {config.source === 'thirdparty' ? '第三方广告ID:' : '自定义代码:'}
                              </div>
                              <Input type="text" placeholder={config.source === 'thirdparty' ? '请输入第三方广告ID' : '请输入自定义广告代码'} value={config.adId || ''} onChange={e => {
                          setAdSettings(prev => ({
                            ...prev,
                            [adType]: {
                              ...prev[adType],
                              adId: e.target.value
                            }
                          }));
                        }} disabled={!config.enabled || !(adSettings && adSettings.globalEnabled)} className="text-sm" />
                              {config.source === 'thirdparty' && config.adId && <div className="text-xs text-green-600">广告ID已设置: {config.adId}</div>}
                              {config.source === 'custom' && config.adId && <div className="text-xs text-blue-600">自定义代码已设置</div>}
                            </div>}
                        </div>
                      </CardContent>
                    </Card>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 会员管理 */}
          <TabsContent value="vip" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>会员卡密管理</CardTitle>
                    <CardDescription>生成和管理会员卡密</CardDescription>
                  </div>
                  <Button onClick={handleGenerateKeys} className="bg-green-600 hover:bg-green-700">
                    <Key className="w-4 h-4 mr-2" />
                    生成卡密
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* 卡密生成表单 */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 border rounded-lg bg-gray-50">
                    <div>
                      <Label htmlFor="cardType" className="text-sm font-medium">卡密类型</Label>
                      <select id="cardType" className="w-full p-2 border rounded mt-1" value={keyGeneration.cardType} onChange={e => setKeyGeneration(prev => ({
                      ...prev,
                      cardType: e.target.value
                    }))}>
                        <option value="monthly">月卡（30天）</option>
                        <option value="quarterly">季度卡（90天）</option>
                        <option value="halfyear">半年卡（180天）</option>
                        <option value="yearly">年卡（365天）</option>
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="quantity" className="text-sm font-medium">数量（张）</Label>
                      <Input id="quantity" type="number" min="1" max="100" value={keyGeneration.quantity} onChange={e => setKeyGeneration(prev => ({
                      ...prev,
                      quantity: parseInt(e.target.value) || 1
                    }))} className="mt-1" />
                    </div>
                    <div>
                      <Label className="text-sm font-medium">时长</Label>
                      <div className="text-sm text-gray-600 mt-1">
                        {keyGeneration.cardType === 'monthly' && '30天'}
                        {keyGeneration.cardType === 'quarterly' && '90天'}
                        {keyGeneration.cardType === 'halfyear' && '180天'}
                        {keyGeneration.cardType === 'yearly' && '365天'}
                      </div>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleGenerateKeys} className="bg-green-600 hover:bg-green-700 w-full">
                        <Key className="w-4 h-4 mr-2" />
                        生成卡密
                      </Button>
                    </div>
                  </div>

                  {/* 卡密列表 */}
                  {vipKeys.map(vipKey => <div key={vipKey.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <code className="font-mono bg-gray-100 px-2 py-1 rounded">{vipKey.key}</code>
                          <Badge variant={vipKey.status === 'active' ? 'default' : vipKey.status === 'disabled' ? 'destructive' : 'secondary'}>
                            {vipKey.status === 'active' ? '已激活' : vipKey.status === 'disabled' ? '已禁用' : '未使用'}
                          </Badge>
                          <span className="text-sm text-gray-500">
                            {vipKey.cardType === 'monthly' ? '月卡' : vipKey.cardType === 'quarterly' ? '季度卡' : vipKey.cardType === 'halfyear' ? '半年卡' : '年卡'}（{vipKey.duration}天）
                          </span>
                        </div>
                        {vipKey.status === 'active' && <div className="text-sm text-gray-500">
                            激活用户: {vipKey.user} | 激活时间: {vipKey.activateTime}
                          </div>}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleToggleKeyStatus(vipKey.id)}>
                          {vipKey.status === 'disabled' ? '启用' : '禁用'}
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleDeleteKey(vipKey.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>)}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 数据看板 */}
          <TabsContent value="analytics">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">总用户数</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-gray-500">+12% 较上月</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">会员用户</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-xs text-gray-500">7.2% 转化率</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">资源下载</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,678</div>
                  <p className="text-xs text-gray-500">日均 189 次</p>
                </CardContent>
              </Card>
            </div>

            <Card className="mt-6">
              <CardHeader>
                <CardTitle>虚拟阅读量配置</CardTitle>
                <CardDescription>配置文章发布后的虚拟阅读量增长规则</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <Label htmlFor="initial-views">发布后1小时</Label>
                    <Input id="initial-views" type="number" defaultValue={10} />
                  </div>
                  <div>
                    <Label htmlFor="day-views">24小时内</Label>
                    <Input id="day-views" type="number" defaultValue={100} />
                  </div>
                  <div>
                    <Label htmlFor="week-views">7天内</Label>
                    <Input id="week-views" type="number" defaultValue={1000} />
                  </div>
                </div>
                <Button>保存配置</Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>;
}