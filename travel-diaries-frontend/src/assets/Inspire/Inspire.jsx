// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Card, CardContent } from '@/components/ui/card';

export default function TravelersCommunityPage() {
  return (
    <div className="bg-white text-black">
      <header className="bg-orange-500 text-white p-4 flex justify-between items-center">
        <div className="font-bold text-lg">Travelers Community</div>
        <div className="space-x-4">
          <Button variant="outline">Login</Button>
          <Button variant="default">Start your first diary</Button>
        </div>
      </header>

      <section className="flex bg-orange-100 p-8">
        <div className="w-1/2">
          <h1 className="text-4xl font-bold mb-4">Travelers Community</h1>
          <p className="text-lg mb-4">Join a vibrant community of travelers sharing their adventures. Seek inspiration, and connect with fellow explorers.</p>
          <Input placeholder="Search by country" className="w-full" />
        </div>
        <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(/path/to/image.jpg)' }}></div>
      </section>

      <section className="text-center my-8">
        <h2 className="text-2xl font-bold mb-4">Check out the latest diaries</h2>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <Card key={item}>
              <CardContent className="h-40 bg-gray-300 flex items-center justify-center">
                Diary {item}
              </CardContent>
            </Card>
          ))}
        </div>
        <Button variant="secondary" className="mt-4">See more diaries</Button>
      </section>

      <section className="bg-orange-100 p-8 rounded-md my-8">
        <h3 className="text-xl font-bold mb-2">Join the community!</h3>
        <p className="mb-4">Capture every detail of your travels, gain personal impact, and share your adventures with a lively, kind, and curious traveler network.</p>
        <Button variant="default">Create your account</Button>
      </section>

      <footer className="bg-gray-200 p-4 text-center">
        <p>&copy; 2025 TravelersCommunity. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </footer>
    </div>
  );
}
