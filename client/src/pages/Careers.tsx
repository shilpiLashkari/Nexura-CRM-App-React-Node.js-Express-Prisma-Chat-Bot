import { Briefcase, MapPin, Clock } from 'lucide-react';

const jobs = [
    {
        id: 'J-101',
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        experience: '5+ Years',
        location: 'Bangalore, India',
        type: 'Full-time',
        description: 'We are looking for an experienced React developer to lead our frontend team. You will be responsible for building scalable and performant UI components.'
    },
    {
        id: 'J-102',
        title: 'Sales Executive',
        department: 'Sales',
        experience: '2+ Years',
        location: 'Mumbai, India',
        type: 'Full-time',
        description: 'Join our dynamic sales team to drive revenue growth. You will be responsible for client acquisition and relationship management.'
    },
    {
        id: 'J-103',
        title: 'Product Designer',
        department: 'Design',
        experience: '3+ Years',
        location: 'Remote',
        type: 'Contract',
        description: 'Creative designer needed to shape the user experience of our CRM product. Proficiency in Figma and design systems is a must.'
    },
    {
        id: 'J-104',
        title: 'Backend Engineer (Node.js)',
        department: 'Engineering',
        experience: '4+ Years',
        location: 'Bangalore, India',
        type: 'Full-time',
        description: 'Build robust APIs and microservices. Experience with Node.js, TypeScript, and SQL databases required.'
    }
];

const Careers = () => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center animate-fade-in-up">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Careers at Nexura</h1>
                    <p className="text-slate-500 dark:text-slate-400">Join us in building the future of enterprise software.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in-up delay-100">
                {jobs.map((job) => (
                    <div key={job.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-6 hover:shadow-lg transition-all group relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <Briefcase size={80} />
                        </div>

                        <div className="flex justify-between items-start mb-4 relative z-10">
                            <div>
                                <span className="text-xs font-semibold px-2 py-1 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                                    {job.department}
                                </span>
                                <h3 className="text-lg font-bold text-slate-800 dark:text-white mt-2">{job.title}</h3>
                                <p className="text-xs text-slate-400 mt-1">Job ID: {job.id}</p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6 relative z-10">
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Briefcase size={16} className="mr-2 text-slate-400" />
                                {job.experience} Experience
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <MapPin size={16} className="mr-2 text-slate-400" />
                                {job.location}
                            </div>
                            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400">
                                <Clock size={16} className="mr-2 text-slate-400" />
                                {job.type}
                            </div>
                            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mt-2">
                                {job.description}
                            </p>
                        </div>

                        <button className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-300 font-medium py-2 rounded-lg transition-colors relative z-10 text-sm">
                            Apply Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Careers;
