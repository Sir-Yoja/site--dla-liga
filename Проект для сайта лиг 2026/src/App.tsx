import React, { useState } from 'react';
import { 
  Trophy, 
  Users, 
  Calendar, 
  LayoutDashboard, 
  UserPlus, 
  PlayCircle, 
  BarChart3, 
  MessageSquare,
  Search,
  Menu,
  X,
  PlusCircle,
  TrendingUp,
  MapPin,
  Clock,
  Video,
  Send,
  LogIn
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types
type View = 'home' | 'leagues' | 'stats' | 'match-center' | 'free-agents' | 'tournaments' | 'gatherer' | 'posters';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const NavItem = ({ id, icon: Icon, label }: { id: View, icon: any, label: string }) => (
    <button
      onClick={() => { setActiveView(id); setIsMenuOpen(false); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
        activeView === id 
          ? 'bg-green-600 text-white shadow-lg shadow-green-900/20' 
          : 'text-gray-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#0f1115] text-white font-sans selection:bg-green-500/30">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#16191e]/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2 cursor-pointer" onClick={() => setActiveView('home')}>
              <div className="bg-green-600 p-1.5 rounded-lg">
                <Trophy size={24} className="text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">Fun<span className="text-green-500">Champ</span></span>
            </div>
            
            <div className="hidden lg:flex items-center space-x-1">
              <NavItem id="leagues" icon={LayoutDashboard} label="Лиги" />
              <NavItem id="stats" icon={BarChart3} label="Статистика" />
              <NavItem id="match-center" icon={PlayCircle} label="Матч-центр" />
              <NavItem id="gatherer" icon={Users} label="Собиратор" />
              <NavItem id="posters" icon={Calendar} label="Афиши" />
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-400 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
              <Search size={18} />
              <input 
                type="text" 
                placeholder="Поиск игрока или команды..." 
                className="bg-transparent border-none focus:outline-none text-sm w-48"
              />
            </div>
            <button 
              onClick={() => setShowAuthModal(true)}
              className="bg-white text-black px-5 py-2 rounded-full font-semibold hover:bg-gray-200 transition-colors flex items-center space-x-2"
            >
              <LogIn size={18} />
              <span>Войти</span>
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 text-gray-400" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-[#0f1115] pt-20 px-4"
          >
            <div className="flex flex-col space-y-4">
              <NavItem id="leagues" icon={LayoutDashboard} label="Лиги" />
              <NavItem id="stats" icon={BarChart3} label="Статистика" />
              <NavItem id="match-center" icon={PlayCircle} label="Матч-центр" />
              <NavItem id="gatherer" icon={Users} label="Собиратор" />
              <NavItem id="posters" icon={Calendar} label="Афиши" />
              <NavItem id="free-agents" icon={UserPlus} label="Свободные игроки" />
              <NavItem id="tournaments" icon={Trophy} label="Турниры" />
              <hr className="border-white/5" />
              <button 
                onClick={() => setShowAuthModal(true)}
                className="w-full bg-green-600 text-white py-3 rounded-xl font-bold"
              >
                Войти в аккаунт
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-24 pb-12 px-4 max-w-7xl mx-auto">
        {activeView === 'home' && <HomeView setActiveView={setActiveView} />}
        {activeView === 'leagues' && <LeaguesView />}
        {activeView === 'stats' && <StatsView />}
        {activeView === 'match-center' && <MatchCenterView />}
        {activeView === 'gatherer' && <GathererView />}
        {activeView === 'posters' && <PostersView />}
        {activeView === 'free-agents' && <FreeAgentsView />}
        {activeView === 'tournaments' && <TournamentsView />}
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowAuthModal(false)} />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-[#1c1f26] w-full max-w-md p-8 rounded-3xl border border-white/10 shadow-2xl"
          >
            <button className="absolute top-4 right-4 text-gray-500" onClick={() => setShowAuthModal(false)}>
              <X size={24} />
            </button>
            <h2 className="text-2xl font-bold mb-2">Добро пожаловать</h2>
            <p className="text-gray-400 mb-8">Войдите, чтобы управлять своей командой или лигой</p>
            
            <div className="space-y-4">
              <AuthButton provider="VK" color="bg-[#4C75A3]" icon="VK" />
              <AuthButton provider="Telegram" color="bg-[#0088CC]" icon="TG" />
              <AuthButton provider="Google" color="bg-white text-black" icon="G" />
              <AuthButton provider="Yandex" color="bg-[#FF0000]" icon="Я" />
            </div>
          </motion.div>
        </div>
      )}

      {/* Footer Nav for Mobile */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#16191e] border-t border-white/5 py-3 px-6 flex justify-between items-center z-40">
        <button onClick={() => setActiveView('home')} className={activeView === 'home' ? 'text-green-500' : 'text-gray-500'}><LayoutDashboard size={24}/></button>
        <button onClick={() => setActiveView('match-center')} className={activeView === 'match-center' ? 'text-green-500' : 'text-gray-500'}><PlayCircle size={24}/></button>
        <button onClick={() => setActiveView('gatherer')} className={activeView === 'gatherer' ? 'text-green-500' : 'text-gray-500'}><PlusCircle size={24}/></button>
        <button onClick={() => setActiveView('stats')} className={activeView === 'stats' ? 'text-green-500' : 'text-gray-500'}><BarChart3 size={24}/></button>
        <button onClick={() => setShowAuthModal(true)} className="text-gray-500"><LogIn size={24}/></button>
      </div>

      <footer className="border-t border-white/5 py-12 mt-12 bg-[#0f1115]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-600 p-1 rounded-lg">
                  <Trophy size={20} />
                </div>
                <span className="text-lg font-bold">Fun<span className="text-green-500">Champ</span></span>
              </div>
              <p className="text-sm text-gray-500">Цифровая экосистема для управления любительскими футбольными лигами по всей России.</p>
            </div>
            <div>
              <h4 className="font-bold mb-4">Разделы</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><button onClick={() => setActiveView('leagues')}>Все Лиги</button></li>
                <li><button onClick={() => setActiveView('stats')}>Статистика игроков</button></li>
                <li><button onClick={() => setActiveView('match-center')}>Расписание матчей</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Для команд</h4>
              <ul className="text-sm text-gray-500 space-y-2">
                <li><button onClick={() => setActiveView('gatherer')}>Собиратор</button></li>
                <li><button onClick={() => setActiveView('free-agents')}>Свободные игроки</button></li>
                <li><button onClick={() => setActiveView('tournaments')}>Турниры</button></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4">Контакты</h4>
              <p className="text-sm text-gray-500">support@funchamp.ru</p>
              <div className="flex space-x-4 mt-4">
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center cursor-pointer hover:bg-white/10 transition-colors">
                  <Send size={16} />
                </div>
              </div>
            </div>
          </div>
          <div className="text-center text-xs text-gray-700 pt-8 border-t border-white/5">
            © 2024 FunChamp. Все права защищены. Разработано для любителей футбола.
          </div>
        </div>
      </footer>
    </div>
  );
};

// --- View Components ---

const HomeView = ({ setActiveView }: { setActiveView: (v: View) => void }) => (
  <div className="space-y-12">
    {/* Hero Section */}
    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-green-600 to-green-900 p-8 lg:p-16">
      <div className="relative z-10 max-w-2xl">
        <motion.span 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-semibold mb-6 inline-block"
        >
          Платформа №1 для любительского футбола
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl lg:text-7xl font-black mb-6 leading-tight"
        >
          СОЗДАЙ СВОЮ <br /> <span className="text-black/30">ИСТОРИЮ</span> ПОБЕД
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-lg text-green-50 mb-8 max-w-lg"
        >
          Управляй лигой, веди статистику матчей, находи новых игроков и следи за трансляциями в реальном времени.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-wrap gap-4"
        >
          <button 
            onClick={() => setActiveView('leagues')}
            className="bg-black text-white px-8 py-4 rounded-2xl font-bold text-lg hover:scale-105 transition-transform"
          >
            Создать лигу
          </button>
          <button 
            onClick={() => setActiveView('tournaments')}
            className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
          >
            Турниры
          </button>
        </motion.div>
      </div>
      <div className="absolute right-0 bottom-0 opacity-20 lg:opacity-100 pointer-events-none">
        <Trophy size={480} className="text-white transform translate-x-32 translate-y-32 rotate-12" />
      </div>
    </div>

    {/* Featured Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard icon={Users} label="Игроков в Лиге" value="327" color="text-blue-500" />
      <StatCard icon={Trophy} label="Команд в сезоне" value="14" color="text-yellow-500" />
      <StatCard icon={PlayCircle} label="Трансляций" value="150+" color="text-red-500" />
      <StatCard icon={TrendingUp} label="Сезон" value="15-й" color="text-green-500" />
    </div>

    {/* Sections Links */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#1c1f26] p-8 rounded-[2rem] border border-white/5 hover:border-green-500/30 transition-colors group cursor-pointer" onClick={() => setActiveView('free-agents')}>
        <div className="flex justify-between items-start mb-6">
          <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-500">
            <UserPlus size={32} />
          </div>
          <span className="text-gray-500 group-hover:text-white transition-colors">Смотреть всех →</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Рынок свободных игроков</h3>
        <p className="text-gray-400">Найди усиление для своей команды или предложи свои услуги капитанам.</p>
      </div>

      <div className="bg-[#1c1f26] p-8 rounded-[2rem] border border-white/5 hover:border-green-500/30 transition-colors group cursor-pointer" onClick={() => setActiveView('tournaments')}>
        <div className="flex justify-between items-start mb-6">
          <div className="bg-purple-500/10 p-4 rounded-2xl text-purple-500">
            <Calendar size={32} />
          </div>
          <span className="text-gray-500 group-hover:text-white transition-colors">Перейти →</span>
        </div>
        <h3 className="text-2xl font-bold mb-2">Однодневные турниры</h3>
        <p className="text-gray-400">Участвуйте в быстрых турнирах выходного дня с призовым фондом.</p>
      </div>
    </div>
  </div>
);

const LeaguesView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-4xl font-bold mb-2">Активные Лиги</h2>
        <p className="text-gray-400">Управляйте существующими лигами или создайте новую</p>
      </div>
      <button className="bg-green-600 px-6 py-3 rounded-xl font-bold flex items-center space-x-2">
        <PlusCircle size={20} />
        <span>Создать лигу</span>
      </button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="bg-[#1c1f26] rounded-3xl overflow-hidden border border-white/5">
        <div className="h-40 bg-gradient-to-r from-red-800 to-red-600 relative">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center p-6 text-center">
            <span className="text-2xl font-black uppercase">Moscow Punk Rock League</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
            <span className="flex items-center"><Users size={16} className="mr-1" /> 14 Команд</span>
            <span className="flex items-center"><MapPin size={16} className="mr-1" /> Москва</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Лидер:</span>
              <span className="font-bold">ФК Старые Дрожжи</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Статус:</span>
              <span className="text-red-500 font-bold uppercase text-[10px]">Сезон 15</span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-green-600 hover:bg-green-700 rounded-xl font-bold transition-colors">
            Открыть таблицу
          </button>
        </div>
      </div>

      <div className="bg-[#1c1f26] rounded-3xl overflow-hidden border border-white/5 opacity-60">
        <div className="h-40 bg-gradient-to-r from-blue-800 to-blue-600 relative">
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="text-3xl font-black">CITY CUP 2025</span>
          </div>
        </div>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 text-sm text-gray-400">
            <span className="flex items-center"><Users size={16} className="mr-1" /> 32 Команды</span>
            <span className="flex items-center"><MapPin size={16} className="mr-1" /> Санкт-Петербург</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">Статус:</span>
              <span className="text-blue-400 font-bold uppercase text-[10px]">Регистрация</span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl font-semibold transition-colors">
            Подать заявку
          </button>
        </div>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-6">Быстрое управление</h3>
        <div className="space-y-4">
          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <PlusCircle className="text-green-500" />
              <span>Добавить команду</span>
            </div>
            <Users size={18} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors">
            <div className="flex items-center space-x-3">
              <PlusCircle className="text-blue-500" />
              <span>Заявить игрока</span>
            </div>
            <UserPlus size={18} className="text-gray-500" />
          </button>
        </div>
      </div>
      
      <div className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-6">Настройки лиги</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="text-xs text-gray-500 mb-1">Формат</div>
            <div className="font-bold">8 x 8</div>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl">
            <div className="text-xs text-gray-500 mb-1">Мяч</div>
            <div className="font-bold">Select Super</div>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5">
      <h3 className="text-xl font-bold mb-6">Турнирная Таблица: Moscow Punk Rock League</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-gray-500 border-b border-white/5">
              <th className="pb-4 font-medium">#</th>
              <th className="pb-4 font-medium">Команда</th>
              <th className="pb-4 font-medium text-center">И</th>
              <th className="pb-4 font-medium text-center">В</th>
              <th className="pb-4 font-medium text-center">Н</th>
              <th className="pb-4 font-medium text-center">П</th>
              <th className="pb-4 font-medium text-center">ГЗ/ГП</th>
              <th className="pb-4 font-medium text-center">Очки</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {[
              { name: 'ФК Старые Дрожжи', i: 19, w: 17, d: 1, l: 1, g: '64-17', p: 52 },
              { name: 'ЛФК Балдёж', i: 19, w: 16, d: 0, l: 3, g: '76-31', p: 48 },
              { name: 'ФК Ракета', i: 19, w: 14, d: 1, l: 4, g: '60-26', p: 43 },
              { name: 'ФК Други', i: 19, w: 11, d: 2, l: 6, g: '54-29', p: 35 },
              { name: 'ФК Петруч', i: 19, w: 11, d: 1, l: 7, g: '56-34', p: 34 },
              { name: 'Fc King is Dead', i: 19, w: 8, d: 4, l: 7, g: '33-40', p: 28 },
              { name: 'ФК Душевой Флирт', i: 19, w: 8, d: 1, l: 10, g: '48-51', p: 25 },
              { name: 'Bedros Pilibos', i: 19, w: 8, d: 1, l: 10, g: '40-47', p: 25 },
              { name: 'ФК Вечер Пятницы', i: 19, w: 8, d: 0, l: 11, g: '49-36', p: 24 },
            ].map((team, idx) => (
              <tr key={idx} className="group hover:bg-white/5 transition-colors">
                <td className="py-4 font-bold">{idx + 1}</td>
                <td className="py-4 font-semibold">{team.name}</td>
                <td className="py-4 text-gray-400 text-center">{team.i}</td>
                <td className="py-4 text-gray-400 text-center">{team.w}</td>
                <td className="py-4 text-gray-400 text-center">{team.d}</td>
                <td className="py-4 text-gray-400 text-center">{team.l}</td>
                <td className="py-4 text-gray-400 text-center">{team.g}</td>
                <td className="py-4 font-bold text-green-500 text-center">{team.p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

const StatsView = () => (
  <div className="space-y-12">
    <div>
      <h2 className="text-4xl font-bold mb-2">Статистика Лиги</h2>
      <p className="text-gray-400">Лидеры сезона по всем показателям</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* G+A Leaders */}
      <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-orange-500/20 text-orange-500 p-2 rounded-lg"><TrendingUp size={24}/></div>
          <h3 className="text-xl font-bold">Гол + Пас</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Димитров Дмитрий', team: 'ФК Ракета', g: 17, a: 17 },
            { name: 'Лысов Платон', team: 'ЛФК Балдёж', g: 25, a: 7 },
            { name: 'Казин Алексей', team: 'ФК Душевой Флирт', g: 19, a: 10 },
            { name: 'Никишин Денис', team: 'ЛФК Балдёж', g: 17, a: 12 },
            { name: 'Левин Михаил', team: 'ФК Вечер Пятницы', g: 15, a: 5 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-[10px] text-gray-500 uppercase">{p.team}</div>
              </div>
              <div className="text-xl font-black text-orange-500">{p.g + p.a}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Best Goalkeepers */}
      <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-blue-500/20 text-blue-500 p-2 rounded-lg"><Trophy size={24}/></div>
          <h3 className="text-xl font-bold">Лучшие Вратари</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Перцев Леонид', team: 'ФК Други', avg: 0.40, games: 5 },
            { name: 'Мирошниченко Дмитрий', team: 'ФК Старые Дрожжи', avg: 0.57, games: 7 },
            { name: 'Хорошин Игорь', team: 'ФК Старые Дрожжи', avg: 0.67, games: 12 },
            { name: 'Климов Кирилл', team: 'ФК Старые Дрожжи', avg: 0.67, games: 6 },
            { name: 'Маркин Дмитрий', team: 'ФК Ракета', avg: 1.41, games: 17 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-[10px] text-gray-500 uppercase">{p.team}</div>
              </div>
              <div className="text-right">
                <div className="text-lg font-black text-blue-500">{p.avg}</div>
                <div className="text-[10px] text-gray-500 uppercase font-bold">{p.games} игр</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Scorers */}
      <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
        <div className="flex items-center space-x-3 mb-6">
          <div className="bg-red-500/20 text-red-500 p-2 rounded-lg"><Trophy size={24}/></div>
          <h3 className="text-xl font-bold">Бомбардиры</h3>
        </div>
        <div className="space-y-4">
          {[
            { name: 'Лысов Платон', team: 'ЛФК Балдёж', g: 25 },
            { name: 'Казин Алексей', team: 'ФК Душевой Флирт', g: 19 },
            { name: 'Димитров Дмитрий', team: 'ФК Ракета', g: 17 },
            { name: 'Никишин Денис', team: 'ЛФК Балдёж', g: 17 },
            { name: 'Никита Костеров', team: 'ФК Петруч', g: 17 },
          ].map((p, i) => (
            <div key={i} className="flex items-center justify-between">
              <div>
                <div className="font-bold text-sm">{p.name}</div>
                <div className="text-[10px] text-gray-500 uppercase">{p.team}</div>
              </div>
              <div className="text-xl font-black text-red-500">{p.g}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

const MatchCenterView = () => (
  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
    <div className="lg:col-span-2 space-y-6">
      <div className="bg-[#1c1f26] p-8 rounded-[2rem] border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center text-3xl">🍺</div>
            <span className="font-bold text-lg text-center">ФК Старые Дрожжи</span>
          </div>
          <div className="text-center">
            <div className="text-sm text-gray-500 uppercase tracking-widest mb-2 font-bold">Центральный матч</div>
            <div className="text-6xl font-black flex items-center space-x-4">
              <span>3</span>
              <span className="text-gray-700">:</span>
              <span>0</span>
            </div>
            <div className="text-xs text-green-500 font-bold mt-2 px-3 py-1 bg-green-500/10 rounded-full inline-block">Завершен</div>
          </div>
          <div className="flex flex-col items-center space-y-2">
            <div className="w-20 h-20 bg-gray-700 rounded-2xl flex items-center justify-center text-3xl">🕺</div>
            <span className="font-bold text-lg text-center">ЛФК Балдёж</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-y border-white/5 mb-8">
          <StatBox label="Удары" home={14} away={8} />
          <StatBox label="В створ" home={6} away={3} />
          <StatBox label="Владение" home="55%" away="45%" />
          <StatBox label="Угловые" home={8} away={4} />
          <StatBox label="Фолы" home={12} away={15} />
          <StatBox label="Офсайды" home={2} away={1} />
          <StatBox label="Желтые" home={1} away={3} />
          <StatBox label="Красные" home={0} away={0} />
        </div>

        <div>
          <h4 className="font-bold mb-4 flex items-center"><PlayCircle size={18} className="mr-2 text-red-500" /> Трансляция матча</h4>
          <div className="aspect-video bg-black rounded-2xl flex items-center justify-center group cursor-pointer border border-white/10">
            <div className="text-center group-hover:scale-110 transition-transform">
              <Video size={64} className="text-red-600 mb-2 mx-auto" />
              <p className="text-sm text-gray-400">Нажмите для просмотра VK Video</p>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2 italic">* Трансляции интегрируются через ссылки VK или YouTube</p>
        </div>
      </div>

      <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-6">Хронология матча</h3>
        <div className="space-y-6">
          <TimelineItem time="12'" player="Иван Иванов" event="Goal" team="home" />
          <TimelineItem time="34'" player="Петр Петров" event="Yellow Card" team="away" />
          <TimelineItem time="45+2'" player="Максим Максимов" event="Goal" team="home" />
          <TimelineItem time="78'" player="Сергей Сергеев" event="Goal" team="away" />
          <TimelineItem time="90'" player="Иван Иванов" event="Goal" team="home" />
        </div>
      </div>
    </div>

    <div className="space-y-6">
      <div className="bg-gradient-to-br from-[#1c1f26] to-[#16191e] p-6 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-4">Предстоящие игры</h3>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white/5 p-4 rounded-2xl border border-white/5">
              <div className="text-[10px] text-gray-500 mb-2 flex justify-between">
                <span>Завтра, 18:00</span>
                <span>Стадион "Арена"</span>
              </div>
              <div className="flex items-center justify-between font-bold text-sm">
                <span>Titan FC</span>
                <span className="text-gray-600 font-black">vs</span>
                <span>Zenith</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
        <h3 className="text-xl font-bold mb-4 flex items-center justify-between">
          <span>Чат матча</span>
          <MessageSquare size={18} className="text-gray-500" />
        </h3>
        <div className="h-64 flex flex-col justify-end">
          <div className="space-y-3 mb-4 overflow-y-auto pr-2 custom-scrollbar">
            <div className="bg-white/5 p-2 rounded-lg text-sm">
              <span className="text-green-500 font-bold block">Болельщик1:</span>
              <span>Шторм сегодня в огне! 🔥</span>
            </div>
            <div className="bg-white/5 p-2 rounded-lg text-sm">
              <span className="text-blue-500 font-bold block">CapitanX:</span>
              <span>Отличный гол на 12 минуте!</span>
            </div>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Написать комментарий (VK)..." 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm focus:outline-none"
            />
            <Send size={16} className="absolute right-3 top-2.5 text-gray-500" />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const GathererView = () => (
  <div className="max-w-4xl mx-auto space-y-8">
    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[2rem] text-white">
      <h2 className="text-3xl font-bold mb-2">Собиратор на матч</h2>
      <p className="text-blue-100">Узнай, кто из команды придет на ближайшую игру</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-[#1c1f26] p-8 rounded-3xl border border-white/5">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold">FC Storm vs Zenith</h3>
            <p className="text-sm text-gray-500">24 Октября, 19:30 • Поле №4</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-green-500">12/15</div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">Состав собран</div>
          </div>
        </div>

        <div className="space-y-2">
          {['Иван Иванов', 'Сергей Петров', 'Андрей Сидоров', 'Николай Валуев', 'Михаил Круг', 'Виктор Цой'].map((name, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-xs">{name[0]}</div>
                <span className="font-medium">{name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${i < 4 ? 'bg-green-500/20 text-green-500' : 'bg-yellow-500/20 text-yellow-500'}`}>
                  {i < 4 ? 'БУДУ' : 'ПОД ВОПРОСОМ'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-[#1c1f26] p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
        <div>
          <h3 className="font-bold mb-4">Ваш статус</h3>
          <div className="space-y-3">
            <button className="w-full py-3 bg-green-600 rounded-xl font-bold hover:bg-green-700 transition-colors">Я приду</button>
            <button className="w-full py-3 bg-yellow-600/20 text-yellow-500 border border-yellow-500/30 rounded-xl font-bold">Возможно</button>
            <button className="w-full py-3 bg-red-600/20 text-red-500 border border-red-500/30 rounded-xl font-bold">Не смогу</button>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/5">
          <p className="text-xs text-gray-500 mb-4">Поделиться ссылкой на сбор в Telegram:</p>
          <button className="w-full py-3 bg-[#0088CC] rounded-xl font-bold flex items-center justify-center space-x-2">
            <Send size={18} />
            <span>Отправить в TG</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);

const PostersView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-center">
      <h2 className="text-4xl font-bold">Афиши и Анонсы</h2>
      <button className="text-gray-400 hover:text-white flex items-center space-x-2">
        <span>Все анонсы</span>
        <PlusCircle size={20} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {[1, 2].map(i => (
        <div key={i} className="group relative overflow-hidden rounded-[2.5rem] bg-[#1c1f26] border border-white/5">
          <div className="h-64 bg-gradient-to-t from-[#1c1f26] to-transparent relative z-10" />
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80')] bg-cover bg-center opacity-50 group-hover:scale-105 transition-transform duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1c1f26] via-transparent to-transparent" />
          
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <span className="bg-red-600 px-3 py-1 rounded-full text-xs font-bold mb-4 inline-block">ГЛАВНОЕ СОБЫТИЕ</span>
            <h3 className="text-3xl font-bold mb-4">Битва за Первое Место: Storm vs Titan</h3>
            <div className="flex items-center space-x-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center"><Clock size={16} className="mr-2" /> 25 Октября, 20:00</span>
              <span className="flex items-center"><MapPin size={16} className="mr-2" /> Лужники, поле №1</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(j => (
                  <div key={j} className="w-10 h-10 rounded-full border-4 border-[#1c1f26] bg-gray-600 overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${j+10}`} alt="avatar" />
                  </div>
                ))}
              </div>
              <span className="text-xs text-gray-500">+145 комментариев из VK</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const FreeAgentsView = () => (
  <div className="space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-4xl font-bold mb-2">Свободные игроки</h2>
        <p className="text-gray-400">Найдите таланты для вашей команды</p>
      </div>
      <button className="bg-blue-600 px-6 py-3 rounded-xl font-bold">Разместить анкету</button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[
        { name: 'Артём Дзюба', pos: 'Нападающий', age: 34, level: 'Pro' },
        { name: 'Кевин Де Брюйне', pos: 'ПЗ', age: 28, level: 'Amateur' },
        { name: 'Вирджил Ван Дейк', pos: 'Защитник', age: 30, level: 'Semi-Pro' },
        { name: 'Нголо Канте', pos: 'ПЗ', age: 29, level: 'Pro' },
      ].map((p, i) => (
        <div key={i} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all text-center">
          <div className="w-24 h-24 rounded-full bg-gray-700 mx-auto mb-4 overflow-hidden">
            <img src={`https://i.pravatar.cc/150?u=${p.name}`} alt={p.name} />
          </div>
          <h3 className="font-bold text-lg mb-1">{p.name}</h3>
          <p className="text-blue-500 text-sm font-semibold mb-4">{p.pos}</p>
          <div className="flex justify-around text-xs text-gray-500 mb-6">
            <div>
              <div className="text-white font-bold">{p.age}</div>
              <div>Лет</div>
            </div>
            <div>
              <div className="text-white font-bold">{p.level}</div>
              <div>Уровень</div>
            </div>
          </div>
          <button className="w-full py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-bold transition-colors">
            Связаться
          </button>
        </div>
      ))}
    </div>
  </div>
);

const TournamentsView = () => (
  <div className="space-y-8">
    <div className="bg-gradient-to-br from-yellow-500 to-orange-600 p-10 rounded-[2.5rem] relative overflow-hidden">
      <div className="relative z-10">
        <h2 className="text-4xl font-black mb-4">ОДНОДНЕВНЫЕ ТУРНИРЫ</h2>
        <p className="text-yellow-100 max-w-lg mb-8">Идеальный формат для тех, кто хочет играть здесь и сейчас. Собрались, отыграли, победили!</p>
        <button className="bg-black text-white px-8 py-3 rounded-xl font-bold">Смотреть календарь</button>
      </div>
      <Trophy size={200} className="absolute right-0 bottom-0 text-white opacity-20 transform translate-x-10 translate-y-10" />
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[1, 2].map(i => (
        <div key={i} className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5 flex items-center space-x-6">
          <div className="bg-yellow-500/10 p-6 rounded-2xl text-yellow-500">
            <Trophy size={40} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">Кубок Выходного Дня</h3>
                <p className="text-gray-400 text-sm">Суббота, 14:00 • 8 команд</p>
              </div>
              <span className="bg-green-500/20 text-green-500 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase">Открыта рега</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <div className="text-sm font-bold text-yellow-500">Приз: 15,000₽</div>
              <button className="text-blue-500 text-sm font-bold">Подробнее →</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// --- Helper Components ---

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-[#1c1f26] p-6 rounded-3xl border border-white/5">
    <Icon size={24} className={`${color} mb-4`} />
    <div className="text-3xl font-black mb-1">{value}</div>
    <div className="text-xs text-gray-500 font-bold uppercase tracking-wider">{label}</div>
  </div>
);

const StatBox = ({ label, home, away }: any) => (
  <div className="bg-white/5 p-3 rounded-2xl">
    <div className="flex justify-between items-center mb-1">
      <span className="font-bold">{home}</span>
      <span className="font-bold">{away}</span>
    </div>
    <div className="h-1 w-full bg-white/10 rounded-full flex">
      <div 
        className="h-full bg-green-500 rounded-l-full" 
        style={{ width: `${typeof home === 'string' ? home : (home / (home + away) * 100)}%` }} 
      />
      <div 
        className="h-full bg-gray-600 rounded-r-full" 
        style={{ width: `${typeof away === 'string' ? away : (away / (home + away) * 100)}%` }} 
      />
    </div>
    <div className="text-[10px] text-center text-gray-500 uppercase mt-2 font-bold">{label}</div>
  </div>
);

const TimelineItem = ({ time, player, event, team }: any) => (
  <div className={`flex items-center space-x-4 ${team === 'away' ? 'flex-row-reverse space-x-reverse' : ''}`}>
    <div className="text-xs font-bold text-gray-500 w-10">{time}</div>
    <div className={`flex-1 p-3 rounded-2xl border border-white/5 bg-white/5 ${team === 'away' ? 'text-right' : ''}`}>
      <span className="font-bold">{player}</span>
      <span className="text-xs text-gray-500 mx-2">•</span>
      <span className="text-xs uppercase font-black text-green-500">{event}</span>
    </div>
  </div>
);

const AuthButton = ({ provider, color, icon }: any) => (
  <button className={`w-full ${color} py-3.5 rounded-2xl font-bold flex items-center justify-center space-x-3 hover:scale-[1.02] transition-transform`}>
    <span className="text-lg font-black">{icon}</span>
    <span>Войти через {provider}</span>
  </button>
);

export default App;
