// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { useToast, Button, Input, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Tabs, TabsContent, TabsList, TabsTrigger, Badge, Avatar, AvatarFallback, AvatarImage } from '@/components/ui';
// @ts-ignore;
import { User, Crown, Coins, Settings, Gift, Shield, Calendar, Eye, Heart, Download } from 'lucide-react';

// @ts-ignore;
import TabBar from '@/components/TabBar';
export default function Profile(props) {
  const {
    toast
  } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [userInfo, setUserInfo] = useState({
    name: '未登录用户',
    avatar: '',
    isLoggedIn: false,
    isVip: false,
    vipExpireAt: null,
    points: 0,
    adFreeCoupons: 0
  });

  // 从数据库加载用户信息
  useEffect(() => {
    const loadUserInfo = async () => {
      try {
        const currentUser = props.$w.auth.currentUser;
        if (currentUser && currentUser.userId) {
          const tcb = await props.$w.cloud.getCloudInstance();
          const db = tcb.database();
          const result = await db.collection('users').where({
            _openid: currentUser.userId
          }).get();
          if (result.data && result.data.length > 0) {
            const userData = result.data[0];
            setUserInfo({
              name: userData.name || currentUser.name || '用户',
              avatar: userData.avatar || currentUser.avatarUrl || '',
              isLoggedIn: true,
              isVip: userData.isVip || false,
              vipExpireAt: userData.vipExpireAt ? new Date(userData.vipExpireAt) : null,
              points: userData.points || 0,
              adFreeCoupons: userData.adFreeCoupons || 0
            });
          } else {
            // 如果用户不存在，创建新用户记录
            await db.collection('users').add({
              data: {
                name: currentUser.name || '用户',
                avatar: currentUser.avatarUrl || '',
                isLoggedIn: true,
                isVip: false,
                vipExpireAt: null,
                points: 0,
                adFreeCoupons: 0
              }
            });
          }
        }
      } catch (error) {
        console.error('加载用户信息失败:', error);
      }
    };
    loadUserInfo();
  }, []);
  const [vipCode, setVipCode] = useState('');

  // 模拟用户历史记录
  const userHistory = [{
    id: 1,
    title: 'Photoshop 2024 安装包',
    type: 'download',
    date: '2024-01-25',
    points: -10
  }, {
    id: 2,
    title: '观看广告获得积分',
    type: 'ad_watch',
    date: '2024-01-24',
    points: +5
  }, {
    id: 3,
    title: '前端开发教程',
    type: 'download',
    date: '2024-01-23',
    points: -10
  }];
  const handleLogin = () => {
    setUserInfo({
      ...userInfo,
      name: '阿良用户',
      isLoggedIn: true,
      points: 50,
      adFreeCoupons: 2
    });
    toast({
      title: '登录成功',
      description: '欢迎使用阿良资源库！'
    });
  };
  const handleActivateVip = async () => {
    if (!vipCode.trim()) {
      toast({
        title: '输入错误',
        description: '请输入有效的卡密',
        variant: 'destructive'
      });
      return;
    }
    if (!userInfo.isLoggedIn) {
      toast({
        title: '未登录',
        description: '请先登录后再激活会员',
        variant: 'destructive'
      });
      return;
    }
    toast({
      title: '正在激活',
      description: '验证卡密中...'
    });
    try {
      // 从数据库查询卡密
      const tcb = await props.$w.cloud.getCloudInstance();
      const db = tcb.database();
      const _ = db.command;

      // 查询匹配的卡密
      const result = await db.collection('vip_cards').where({
        cardPassword: vipCode.trim(),
        status: '未使用'
      }).get();
      if (result.data.length === 0) {
        toast({
          title: '激活失败',
          description: '卡密不存在或已被使用',
          variant: 'destructive'
        });
        return;
      }
      const card = result.data[0];
      const userId = props.$w.auth.currentUser?.userId || 'unknown';

      // 更新卡密状态为已使用
      await db.collection('vip_cards').doc(card._id).update({
        status: '已使用',
        usedBy: userId,
        usedAt: Date.now()
      });

      // 计算VIP过期时间
      const expireTime = new Date(Date.now() + card.duration * 24 * 60 * 60 * 1000);

      // 查找用户记录
      const userResult = await db.collection('users').where({
        _openid: userId
      }).get();
      if (userResult.data && userResult.data.length > 0) {
        // 更新现有用户记录
        await db.collection('users').doc(userResult.data[0]._id).update({
          isVip: true,
          vipExpireAt: expireTime.getTime()
        });
      } else {
        // 创建新用户记录
        await db.collection('users').add({
          data: {
            name: props.$w.auth.currentUser?.name || '用户',
            avatar: props.$w.auth.currentUser?.avatarUrl || '',
            isLoggedIn: true,
            isVip: true,
            vipExpireAt: expireTime.getTime(),
            points: 0,
            adFreeCoupons: 0
          }
        });
      }

      // 重新加载用户信息以确保状态同步
      const updatedUserResult = await db.collection('users').where({
        _openid: userId
      }).get();
      if (updatedUserResult.data && updatedUserResult.data.length > 0) {
        const updatedUserData = updatedUserResult.data[0];
        setUserInfo({
          name: updatedUserData.name || props.$w.auth.currentUser?.name || '用户',
          avatar: updatedUserData.avatar || props.$w.auth.currentUser?.avatarUrl || '',
          isLoggedIn: true,
          isVip: updatedUserData.isVip || false,
          vipExpireAt: updatedUserData.vipExpireAt ? new Date(updatedUserData.vipExpireAt) : null,
          points: updatedUserData.points || 0,
          adFreeCoupons: updatedUserData.adFreeCoupons || 0
        });
      }
      setVipCode('');
      toast({
        title: '激活成功',
        description: `${card.cardType}会员已激活，有效期至${expireTime.toLocaleDateString()}`,
        variant: 'success'
      });
    } catch (error) {
      console.error('卡密激活失败:', error);
      toast({
        title: '激活失败',
        description: error.message || '系统错误，请稍后重试',
        variant: 'destructive'
      });
    }
  };
  const handleWatchAd = () => {
    toast({
      title: '广告播放',
      description: '正在播放激励视频...'
    });
    setTimeout(() => {
      setUserInfo({
        ...userInfo,
        points: userInfo.points + 5
      });
      toast({
        title: '获得积分',
        description: '成功获得5积分！',
        variant: 'success'
      });
    }, 3000);
  };
  const handleExchangeCoupon = () => {
    if (userInfo.points < 20) {
      toast({
        title: '积分不足',
        description: '需要20积分才能兑换免广告券',
        variant: 'destructive'
      });
      return;
    }
    setUserInfo({
      ...userInfo,
      points: userInfo.points - 20,
      adFreeCoupons: userInfo.adFreeCoupons + 1
    });
    toast({
      title: '兑换成功',
      description: '获得1张免广告券！',
      variant: 'success'
    });
  };
  return <div className="min-h-screen bg-gray-50">
      {/* 顶部导航 */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 font-['Playfair_Display']">个人中心</h1>
            <Button variant="ghost" onClick={() => props.$w.utils.navigateTo({
            pageId: 'home',
            params: {}
          })} className="text-gray-600 hover:text-gray-900">
              返回首页
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* 用户信息卡片 */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={userInfo.avatar} />
                <AvatarFallback className="bg-blue-100 text-blue-600">
                  <User className="w-8 h-8" />
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h2 className="text-xl font-semibold">{userInfo.name}</h2>
                  {userInfo.isVip && <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500">
                      <Crown className="w-3 h-3 mr-1" />
                      VIP会员
                    </Badge>}
                </div>
                {!userInfo.isLoggedIn ? <Button onClick={handleLogin} className="bg-blue-600 hover:bg-blue-700">
                    立即登录
                  </Button> : <div className="text-sm text-gray-600">
                    {userInfo.isVip ? <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        会员到期: {userInfo.vipExpireAt?.toLocaleDateString()}
                      </span> : <span>普通用户</span>}
                  </div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">账户概览</TabsTrigger>
            <TabsTrigger value="vip">会员中心</TabsTrigger>
            <TabsTrigger value="history">使用记录</TabsTrigger>
          </TabsList>

          {/* 账户概览 */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {/* 积分卡片 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Coins className="w-5 h-5 mr-2 text-yellow-500" />
                    我的积分
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-yellow-600 mb-4">{userInfo.points}</div>
                  <div className="space-y-2">
                    <Button onClick={handleWatchAd} className="w-full" disabled={!userInfo.isLoggedIn}>
                      看广告得积分
                    </Button>
                    <Button variant="outline" onClick={handleExchangeCoupon} className="w-full" disabled={!userInfo.isLoggedIn}>
                      兑换免广告券 (20积分)
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* 特权卡片 */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center">
                    <Shield className="w-5 h-5 mr-2 text-green-500" />
                    我的特权
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span>免广告券</span>
                      <Badge variant="secondary">{userInfo.adFreeCoupons}张</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>会员状态</span>
                      <Badge variant={userInfo.isVip ? "default" : "secondary"}>
                        {userInfo.isVip ? "有效" : "未开通"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* 广告横幅区域 */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="text-sm text-gray-600 mb-2">广告位</div>
                <div className="h-20 bg-white rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                  <span className="text-gray-400">横幅广告展示区域</span>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 会员中心 */}
          <TabsContent value="vip" className="space-y-4">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center text-2xl">
                  <Crown className="w-6 h-6 mr-2 text-yellow-600" />
                  会员特权
                </CardTitle>
                <CardDescription>
                  开通会员享受专属权益，资源下载免广告
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">月卡</div>
                    <div className="text-lg text-orange-600 font-semibold">¥29.9</div>
                    <div className="text-sm text-gray-600 mt-2">30天会员权益</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border-2 border-yellow-300">
                    <div className="text-2xl font-bold text-gray-900">季卡</div>
                    <div className="text-lg text-orange-600 font-semibold">¥79.9</div>
                    <div className="text-sm text-gray-600 mt-2">90天会员权益</div>
                    <Badge className="mt-2 bg-red-500">热门</Badge>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg">
                    <div className="text-2xl font-bold text-gray-900">年卡</div>
                    <div className="text-lg text-orange-600 font-semibold">¥299</div>
                    <div className="text-sm text-gray-600 mt-2">365天会员权益</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    所有资源下载免广告
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    专属高速下载通道
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    优先获取新资源通知
                  </div>
                </div>

                <div className="space-y-3">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600">
                    前往购买会员卡密
                  </Button>
                  
                  <div className="flex space-x-2">
                    <Input placeholder="请输入会员卡密" value={vipCode} onChange={e => setVipCode(e.target.value)} className="flex-1" />
                    <Button onClick={handleActivateVip} disabled={!userInfo.isLoggedIn} className="bg-green-600 hover:bg-green-700">
                      激活会员
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* 使用记录 */}
          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>使用记录</CardTitle>
                <CardDescription>最近的操作记录</CardDescription>
              </CardHeader>
              <CardContent>
                {userInfo.isLoggedIn ? <div className="space-y-3">
                    {userHistory.map(record => <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          {record.type === 'download' && <Download className="w-5 h-5 text-blue-500" />}
                          {record.type === 'ad_watch' && <Eye className="w-5 h-5 text-green-500" />}
                          <div>
                            <div className="font-medium">{record.title}</div>
                            <div className="text-sm text-gray-500">{record.date}</div>
                          </div>
                        </div>
                        <Badge variant={record.points > 0 ? "default" : "secondary"}>
                          {record.points > 0 ? '+' : ''}{record.points}积分
                        </Badge>
                      </div>)}
                  </div> : <div className="text-center py-8 text-gray-500">
                    请先登录查看使用记录
                  </div>}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      
      {/* 底部导航栏 */}
      <TabBar activeTab="profile" onTabChange={tabId => {
      if (tabId === 'home') {
        props.$w.utils.navigateTo({
          pageId: 'home',
          params: {}
        });
      } else if (tabId === 'admin') {
        props.$w.utils.navigateTo({
          pageId: 'admin',
          params: {}
        });
      }
    }} />
    </div>;
}