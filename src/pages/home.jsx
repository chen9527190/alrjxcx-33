// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Input, Badge, useToast } from '@/components/ui';
// @ts-ignore;
import { Calendar, User, Key, Settings } from 'lucide-react';

export default function Home(props) {
  const {
    toast
  } = useToast();
  const [userInfo, setUserInfo] = useState(null);
  const [vipCard, setVipCard] = useState(null);
  const [cardKey, setCardKey] = useState('');
  const [loading, setLoading] = useState(false);

  // 获取当前用户信息
  useEffect(() => {
    const currentUser = props.$w?.auth?.currentUser;
    if (currentUser) {
      setUserInfo({
        name: currentUser.nickName || currentUser.name || '用户',
        avatar: currentUser.avatarUrl
      });
      fetchUserVipCard(currentUser.userId);
    }
  }, [props.$w?.auth?.currentUser]);

  // 查询用户VIP卡信息
  const fetchUserVipCard = async userId => {
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'database',
        data: {
          action: 'query',
          collection: 'vip_cards',
          query: {
            userId,
            status: 'active'
          }
        }
      });
      if (result.result.data && result.result.data.length > 0) {
        setVipCard(result.result.data[0]);
      }
    } catch (error) {
      console.error('获取VIP卡信息失败:', error);
    }
  };

  // 激活VIP卡
  const activateVipCard = async () => {
    if (!cardKey.trim()) {
      toast({
        title: '输入错误',
        description: '请输入有效的卡密',
        variant: 'destructive'
      });
      return;
    }
    setLoading(true);
    try {
      const result = await props.$w.cloud.callFunction({
        name: 'database',
        data: {
          action: 'update',
          collection: 'vip_cards',
          query: {
            cardKey: cardKey.trim(),
            status: 'inactive'
          },
          update: {
            status: 'active',
            userId: props.$w.auth.currentUser.userId,
            activatedAt: new Date().toISOString()
          }
        }
      });
      if (result.result.updated > 0) {
        toast({
          title: '激活成功',
          description: 'VIP卡已成功激活'
        });
        setCardKey('');
        fetchUserVipCard(props.$w.auth.currentUser.userId);
      } else {
        toast({
          title: '激活失败',
          description: '卡密无效或已被使用',
          variant: 'destructive'
        });
      }
    } catch (error) {
      toast({
        title: '激活失败',
        description: '网络错误，请重试',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  // 跳转到管理页面
  const goToAdmin = () => {
    props.$w.utils.navigateTo({
      pageId: 'admin',
      params: {}
    });
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* 头部信息 */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">VIP会员系统</h1>
            <p className="text-slate-600 mt-1">欢迎使用会员服务</p>
          </div>
          <div className="flex items-center space-x-4">
            {userInfo && <div className="flex items-center space-x-2">
                {userInfo.avatar && <img src={userInfo.avatar} alt="用户头像" className="w-8 h-8 rounded-full" />}
                <span className="text-slate-700 font-medium">{userInfo.name}</span>
              </div>}
            <Button variant="outline" onClick={goToAdmin}>
              <Settings className="w-4 h-4 mr-2" />
              管理后台
            </Button>
          </div>
        </div>

        {/* 主要内容 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 用户信息卡片 */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-x-4">
              <User className="w-8 h-8 text-blue-600" />
              <div>
                <CardTitle>用户信息</CardTitle>
                <CardDescription>当前账户状态</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {userInfo ? <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">用户名:</span>
                    <span className="font-medium">{userInfo.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">会员状态:</span>
                    {vipCard ? <Badge variant="success">VIP会员</Badge> : <Badge variant="secondary">普通用户</Badge>}
                  </div>
                </div> : <p className="text-slate-500">请先登录</p>}
            </CardContent>
          </Card>

          {/* VIP状态卡片 */}
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Key className="w-8 h-8 text-green-600" />
              <div>
                <CardTitle>VIP状态</CardTitle>
                <CardDescription>会员权益信息</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              {vipCard ? <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-600">卡密类型:</span>
                    <span className="font-medium">{vipCard.cardType === 'monthly' ? '月卡' : '年卡'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">激活时间:</span>
                    <span className="font-medium">
                      {new Date(vipCard.activatedAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-600">到期时间:</span>
                    <span className="font-medium">
                      {new Date(vipCard.expiresAt).toLocaleDateString('zh-CN')}
                    </span>
                  </div>
                </div> : <p className="text-slate-500">暂无激活的VIP卡</p>}
            </CardContent>
          </Card>

          {/* 卡密激活 */}
          <Card className="bg-white/80 backdrop-blur-sm lg:col-span-2">
            <CardHeader className="flex flex-row items-center space-x-4">
              <Calendar className="w-8 h-8 text-orange-600" />
              <div>
                <CardTitle>激活VIP卡</CardTitle>
                <CardDescription>输入卡密激活会员服务</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-4">
                <Input placeholder="请输入卡密" value={cardKey} onChange={e => setCardKey(e.target.value)} className="flex-1" />
                <Button onClick={activateVipCard} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? '激活中...' : '立即激活'}
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-2">
                请输入正确的卡密进行激活，激活后即可享受VIP会员服务
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 功能说明 */}
        <Card className="mt-6 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>系统功能</CardTitle>
            <CardDescription>VIP会员系统主要功能</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4">
                <Key className="w-12 h-12 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold">卡密管理</h3>
                <p className="text-sm text-slate-600 mt-1">生成和管理VIP卡密</p>
              </div>
              <div className="text-center p-4">
                <User className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold">用户管理</h3>
                <p className="text-sm text-slate-600 mt-1">查看用户信息和状态</p>
              </div>
              <div className="text-center p-4">
                <Calendar className="w-12 h-12 text-orange-600 mx-auto mb-2" />
                <h3 className="font-semibold">有效期管理</h3>
                <p className="text-sm text-slate-600 mt-1">管理会员有效期和续费</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
}