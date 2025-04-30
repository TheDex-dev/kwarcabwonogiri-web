import Image from "next/image";

export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Left side background */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 opacity-30 dark:opacity-20">
        <Image
          src="/background/side-by-side stacked.svg"
          alt="Background decoration"
          width={500}
          height={800}
          className="w-auto h-auto"
        />
      </div>
      
      {/* Right side background */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 opacity-30 dark:opacity-20">
        <Image
          src="/background/side-by-side stacked.svg"
          alt="Background decoration"
          width={500}
          height={800}
          className="w-auto h-auto transform rotate-180"
        />
      </div>

      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12 relative z-10">
          <div className="text-center mb-20 animate-fade-in">
            <h1 className="text-5xl font-bold mb-4 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
              Profil Kwarcab Wonogiri
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto">
              Mengenal lebih dekat Gerakan Pramuka Kuartir Cabang Wonogiri
            </p>
            <div className="relative w-full max-w-3xl mx-auto rounded-2xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-300">
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent z-10"></div>
              <Image
                src="/images/profile.jpeg"
                alt="Kwarcab Wonogiri"
                width={800} 
                height={450} 
              />
            </div>
          </div>
          {/* Visi & Misi */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Visi & Misi</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-blue-600 dark:text-blue-400">Visi</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                Gerakan Pramuka sebagai wadah pilihan utama dan solusi handal masalah-masalah kaum muda
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300">
              <h3 className="text-2xl font-semibold mb-6 text-green-600 dark:text-green-400">Misi</h3>
              <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-3">
                <li className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Mempramukaan kaum muda</li>
                <li className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Membina anggota yang berjiwa dan berkepribadian pancasila</li>
                <li className="hover:text-green-600 dark:hover:text-green-400 transition-colors">Membentuk kader pembangunan yang berjiwa patriot</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Program Unggulan */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Program Unggulan</h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Pelatihan Kepemimpinan",
                description: "Program pengembangan jiwa kepemimpinan bagi anggota pramuka",
                icon: "👥",
                color: "from-blue-500 to-blue-600"
              },
              {
                title: "Bakti Sosial",
                description: "Kegiatan sosial untuk membantu masyarakat sekitar",
                icon: "🤝",
                color: "from-green-500 to-green-600"
              },
              {
                title: "Pendidikan Lingkungan",
                description: "Program pelestarian dan pendidikan lingkungan hidup",
                icon: "🌱",
                color: "from-emerald-500 to-emerald-600"
              }
            ].map((program, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-8 transition-all duration-300 hover:-translate-y-2 group"
              >
                <div className={`text-5xl mb-6 transform group-hover:scale-110 transition-transform duration-300`}>
                  {program.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 dark:text-white bg-gradient-to-r bg-clip-text text-transparent ${program.color}">
                  {program.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="mb-20">
          <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Struktur Organisasi</h2>
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-8">
            <div className="grid gap-6">
              <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-md transition-shadow">
                <h3 className="font-bold text-xl mb-2 dark:text-white">Ketua</h3>
                <p className="text-gray-600 dark:text-gray-300">Anon</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-xl mb-2 dark:text-white">Wakil Ketua I</h3>
                  <p className="text-gray-600 dark:text-gray-300">Anon</p>
                </div>
                <div className="text-center p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gradient-to-br from-blue-50 to-white dark:from-gray-700 dark:to-gray-800 hover:shadow-md transition-shadow">
                  <h3 className="font-bold text-xl mb-2 dark:text-white">Wakil Ketua II</h3>
                  <p className="text-gray-600 dark:text-gray-300">Anon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section>
          <h2 className="text-3xl font-bold mb-8 dark:text-white text-center">Kontak</h2>
          <div className="bg-white/80 backdrop-blur-sm dark:bg-gray-800/80 rounded-xl shadow-lg p-8">
            <div className="space-y-6 text-gray-600 dark:text-gray-300">
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors">
                <p className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Alamat</p>
                <p>Anon</p>
              </div>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors">
                <p className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Email</p>
                <p>Anon</p>
              </div>
              <div className="hover:bg-gray-50 dark:hover:bg-gray-700/50 p-4 rounded-lg transition-colors">
                <p className="font-bold text-lg mb-2 text-blue-600 dark:text-blue-400">Telepon</p>
                <p>Anon</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}