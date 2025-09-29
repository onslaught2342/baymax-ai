import BaymaxChat from '@/components/BaymaxChat';
import ThemeToggle from '@/components/ThemeToggle';

const Index = () => {
  return (
    <div className="min-h-screen gradient-animated relative overflow-hidden">
      {/* Ambient glow effects */}
      <div className="absolute inset-0 gradient-glow pointer-events-none" />
      <div className="absolute top-20 left-10 w-32 h-32 bg-primary/5 rounded-full blur-xl animate-float" />
      <div className="absolute bottom-20 right-10 w-24 h-24 bg-primary-glow/5 rounded-full blur-xl animate-float" style={{ animationDelay: '2s' }} />
      
      {/* Theme toggle */}
      <div className="absolute top-6 right-6 z-10">
        <ThemeToggle />
      </div>
      
      <div className="relative z-10 p-4 md:p-8 min-h-screen flex flex-col">
        <div className="max-w-4xl mx-auto flex-1 flex flex-col">
          <div className="text-center mb-8 animate-message-in">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse-glow">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-6 h-6 rounded-full bg-primary" />
                </div>
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Meet <span className="bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">Baymax</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Your personal healthcare companion powered by advanced AI. 
              <br className="hidden md:block" />
              Caring, gentle, and always ready to help with your wellness needs.
            </p>
          </div>
          
          <div className="flex-1 max-w-4xl mx-auto w-full">
            <div className="h-[600px] md:h-[700px]">
              <BaymaxChat className="h-full animate-message-in" style={{ animationDelay: '0.2s' }} />
            </div>
          </div>
          
          <div className="text-center mt-8 text-sm text-muted-foreground animate-message-in" style={{ animationDelay: '0.4s' }}>
            <p className="opacity-75">
              Baymax is designed to be your caring digital healthcare companion.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
