import { useEffect, useState, memo } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Plus, X, Link } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  title: string;
  company: string;
  followers: string;
  growthRate: string;
  topics: string[];
  imageUrl?: string;
  verified?: boolean;
  isCustom?: boolean;
  url?: string;
}

const mockCreators: Creator[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    title: 'VP of Engineering → Founder',
    company: 'TechStart Inc.',
    followers: '125K',
    growthRate: '+8.2K/mo',
    topics: ['Leadership', 'Tech', 'Startups'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    verified: true
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    title: 'Data Scientist → AI Consultant',
    company: 'DataWise Consulting',
    followers: '89K',
    growthRate: '+6.5K/mo',
    topics: ['AI/ML', 'Data Science', 'Python'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael'
  },
  {
    id: '3',
    name: 'Emily Thompson',
    title: 'Product Manager → CPO',
    company: 'ProductLab',
    followers: '156K',
    growthRate: '+9.1K/mo',
    topics: ['Product', 'Strategy', 'Growth'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    verified: true
  },
  {
    id: '4',
    name: 'James Wilson',
    title: 'Developer → Tech Lead',
    company: 'Microsoft',
    followers: '234K',
    growthRate: '+12K/mo',
    topics: ['Engineering', 'Cloud', 'DevOps'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James'
  },
  {
    id: '5',
    name: 'Lisa Park',
    title: 'Designer → Design Director',
    company: 'Figma',
    followers: '178K',
    growthRate: '+7.8K/mo',
    topics: ['Design', 'UX', 'Leadership'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa',
    verified: true
  },
  {
    id: '6',
    name: 'David Kumar',
    title: 'Sales Rep → Sales Director',
    company: 'Salesforce',
    followers: '92K',
    growthRate: '+5.2K/mo',
    topics: ['Sales', 'B2B', 'SaaS'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David'
  },
  {
    id: '7',
    name: 'Anna Martinez',
    title: 'Marketing Analyst → CMO',
    company: 'GrowthCo',
    followers: '143K',
    growthRate: '+8.9K/mo',
    topics: ['Marketing', 'Growth', 'Brand'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna'
  },
  {
    id: '8',
    name: 'Robert Chang',
    title: 'Consultant → Partner',
    company: 'McKinsey & Company',
    followers: '201K',
    growthRate: '+10K/mo',
    topics: ['Strategy', 'Consulting', 'Business'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
    verified: true
  },
  {
    id: '9',
    name: 'Sophie Turner',
    title: 'HR Manager → CHRO',
    company: 'PeopleFirst',
    followers: '67K',
    growthRate: '+4.1K/mo',
    topics: ['HR', 'Culture', 'Leadership'],
    imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie'
  }
];

type FindingCreatorsStepProps = {
  onNext: (values: string[]) => void;
  initialValues?: string[];
};

const FindingCreatorsStep = memo(function FindingCreatorsStep({ 
  onNext, 
  initialValues = [] 
}: FindingCreatorsStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [currentMessage, setCurrentMessage] = useState(0);
  const [selectedCreators, setSelectedCreators] = useState<string[]>(initialValues);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [customUrls, setCustomUrls] = useState<string[]>([]);

  const messages = [
    "Analyzing your professional profile...",
    "Finding creators with similar starting points...",
    "Identifying successful growth patterns...",
    "Matching you with proven strategies..."
  ];

  useEffect(() => {
    if (!isLoading) return;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsLoading(false), 200);
          return 100;
        }
        return prev + (100 / 30); // Complete in 3 seconds
      });
    }, 100);

    // Message rotation
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 750);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
    };
  }, [isLoading]);

  useEffect(() => {
    // Update parent with all selections (creators + custom URLs)
    const allSelections = [...selectedCreators, ...customUrls];
    onNext(allSelections);
  }, [selectedCreators, customUrls, onNext]);

  const toggleCreator = (creatorId: string) => {
    const newSelection = selectedCreators.includes(creatorId)
      ? selectedCreators.filter(id => id !== creatorId)
      : [...selectedCreators, creatorId];
    setSelectedCreators(newSelection);
  };

  const handleAddLinkedInUrl = () => {
    const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/;
    
    if (linkedinUrl && urlPattern.test(linkedinUrl)) {
      const formattedUrl = linkedinUrl.startsWith('http') ? linkedinUrl : `https://${linkedinUrl}`;
      if (!customUrls.includes(formattedUrl)) {
        setCustomUrls([...customUrls, formattedUrl]);
        setLinkedinUrl('');
        setShowUrlInput(false);
      }
    }
  };

  const removeCustomUrl = (url: string) => {
    setCustomUrls(customUrls.filter(u => u !== url));
  };

  const validateLinkedInUrl = (url: string) => {
    const urlPattern = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[a-zA-Z0-9-]+\/?$/;
    return urlPattern.test(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          
          <h2 className="text-2xl font-semibold">
            Finding Your Success Path
          </h2>
          
          <p className="text-muted-foreground max-w-md mx-auto">
            We're analyzing thousands of LinkedIn creators who started where you are and achieved the goals you're targeting
          </p>
        </div>

        <div className="space-y-6 max-w-md mx-auto">
          <div className="space-y-2">
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-100 ease-linear rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-muted-foreground text-center">
              {Math.round(progress)}% Complete
            </p>
          </div>

          <div className="min-h-[48px] flex items-center justify-center">
            <p className="text-sm text-muted-foreground text-center animate-pulse">
              {messages[currentMessage]}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-semibold">Select Creators to Learn From</h2>
        <p className="text-muted-foreground">
          Choose creators whose growth journey matches your goals. We'll analyze their strategies to help you succeed.
        </p>
      </div>

      {/* Custom URL Input Section */}
      <div className="border-b pb-4">
        {!showUrlInput ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowUrlInput(true)}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Your Own LinkedIn Profile
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <Input
                placeholder="linkedin.com/in/username or linkedin.com/company/..."
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddLinkedInUrl();
                  }
                }}
                className={linkedinUrl && !validateLinkedInUrl(linkedinUrl) ? 'border-destructive' : ''}
              />
              <Button
                size="sm"
                onClick={handleAddLinkedInUrl}
                disabled={!linkedinUrl || !validateLinkedInUrl(linkedinUrl)}
              >
                Add
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setShowUrlInput(false);
                  setLinkedinUrl('');
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            {linkedinUrl && !validateLinkedInUrl(linkedinUrl) && (
              <p className="text-xs text-destructive">Please enter a valid LinkedIn profile or company URL</p>
            )}
          </div>
        )}

        {/* Display custom URLs */}
        {customUrls.length > 0 && (
          <div className="mt-3 space-y-2">
            {customUrls.map((url) => (
              <div key={url} className="flex items-center justify-between p-2 bg-primary/5 rounded-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Link className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm truncate">{url}</span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCustomUrl(url)}
                  className="flex-shrink-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Suggested Creators */}
      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        <p className="text-sm text-muted-foreground font-medium">Suggested Creators</p>
        <div className="grid gap-3">
          {mockCreators.map((creator) => (
            <button
              key={creator.id}
              onClick={() => toggleCreator(creator.id)}
              className={`relative p-4 rounded-lg border transition-all text-left ${
                selectedCreators.includes(creator.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-accent/50'
              }`}
            >
              {selectedCreators.includes(creator.id) && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              )}
              
              <div className="flex items-start gap-4">
                <Avatar className="w-12 h-12">
                  <AvatarImage src={creator.imageUrl} alt={creator.name} />
                  <AvatarFallback>{creator.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold truncate">{creator.name}</h3>
                    {creator.verified && (
                      <Badge variant="secondary" className="text-xs">Verified</Badge>
                    )}
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">{creator.title}</p>
                  <p className="text-sm text-muted-foreground mb-3">{creator.company}</p>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">{creator.followers} followers</span>
                    <span className="text-green-600 font-medium">{creator.growthRate}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {creator.topics.map((topic) => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {(selectedCreators.length > 0 || customUrls.length > 0) && (
        <div className="text-center text-sm text-muted-foreground">
          {selectedCreators.length + customUrls.length} total selection{(selectedCreators.length + customUrls.length) !== 1 ? 's' : ''} 
          {customUrls.length > 0 && ` (${customUrls.length} custom URL${customUrls.length !== 1 ? 's' : ''})`}
        </div>
      )}
    </div>
  );
});

export default FindingCreatorsStep;