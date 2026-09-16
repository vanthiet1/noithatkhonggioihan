'use client';

import { useState } from 'react';
import SafeImage from '@/components/SafeImage';
import Link from 'next/link';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeaturedProjectsClient({ projects }: { projects: any[] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalPages = Math.ceil(projects.length / itemsPerPage);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 text-left">
        {paginatedProjects.length > 0 ? (
          paginatedProjects.map((project: any, idx: number) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border border-gray-100 flex flex-col group transition hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.15)]">
               <div className="relative h-64 overflow-hidden bg-gray-100">
                 {project.image_url ? (
                   <SafeImage 
                     src={project.image_url} 
                     alt={project.title} 
                     fill 
                     sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw" 
                     className="object-cover group-hover:scale-105 transition-transform duration-700" 
                     widthParam={600}
                     priority={idx < 4}
                   />
                 ) : null}
               </div>
               <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-gray-900 font-bold text-lg mb-1 group-hover:text-primary transition line-clamp-2">{project.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 flex-grow line-clamp-2">{project.location}</p>
                  
                  {project.link ? (
                    <Link href={project.link} className="block w-full text-center py-2.5 rounded-lg border border-primary text-primary hover:bg-primary hover:text-white font-semibold transition text-sm flex items-center justify-center">
                      <ArrowUpRight className="w-4 h-4 mr-1" /> Xem Công Trình
                    </Link>
                  ) : (
                    <div className="block w-full text-center py-2.5 rounded-lg border border-gray-200 text-gray-400 font-semibold text-sm flex items-center justify-center cursor-not-allowed">
                      Không có liên kết
                    </div>
                  )}
               </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            Chưa có công trình tiêu biểu nào.
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentPage === page 
                    ? 'bg-primary text-white shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
