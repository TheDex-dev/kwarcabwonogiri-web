export default function Profile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="max-w-4xl mx-auto px-4 pt-24 pb-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4 dark:text-white">Profil Kwarcab Wonogiri</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Mengenal lebih dekat Gerakan Pramuka Kuartir Cabang Wonogiri</p>
          <div className="relative w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-lg">
            <img 
              src="/kwarcabwonogiri-web/images/profile.jpeg" 
              alt="Kwarcab Wonogiri"
              className="w-full h-auto"
            />
          </div>
        </div>

        {/* Visi & Misi */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Visi & Misi</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 text-blue-600 dark:text-blue-400">Visi</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Gerakan Pramuka sebagai wadah pilihan utama dan solusi handal masalah-masalah kaum muda
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold mb-4 text-green-600 dark:text-green-400">Misi</h3>
              <ul className="text-gray-600 dark:text-gray-300 list-disc list-inside space-y-2">
                <li>Mempramukaan kaum muda</li>
                <li>Membina anggota yang berjiwa dan berkepribadian pancasila</li>
                <li>Membentuk kader pembangunan yang berjiwa patriot</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Program Unggulan */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Program Unggulan</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                title: 'Pelatihan Kepemimpinan',
                description: 'Program pengembangan jiwa kepemimpinan bagi anggota pramuka',
                icon: '👥'
              },
              {
                title: 'Bakti Sosial',
                description: 'Kegiatan sosial untuk membantu masyarakat sekitar',
                icon: '🤝'
              },
              {
                title: 'Pendidikan Lingkungan',
                description: 'Program pelestarian dan pendidikan lingkungan hidup',
                icon: '🌱'
              }
            ].map((program, idx) => (
              <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 transition-transform hover:-translate-y-1">
                <div className="text-4xl mb-4">{program.icon}</div>
                <h3 className="text-xl font-semibold mb-2 dark:text-white">{program.title}</h3>
                <p className="text-gray-600 dark:text-gray-300">{program.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Struktur Organisasi */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Struktur Organisasi</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="grid gap-4">
              <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                <h3 className="font-semibold dark:text-white">Ketua</h3>
                <p className="text-gray-600 dark:text-gray-300">Anon</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold dark:text-white">Wakil Ketua I</h3>
                  <p className="text-gray-600 dark:text-gray-300">Anon</p>
                </div>
                <div className="text-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold dark:text-white">Wakil Ketua II</h3>
                  <p className="text-gray-600 dark:text-gray-300">Aon</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Kontak */}
        <section>
          <h2 className="text-2xl font-semibold mb-6 dark:text-white">Kontak</h2>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>
                <span className="font-semibold">Alamat:</span><br />
                Anon
              </p>
              <p>
                <span className="font-semibold">Email:</span><br />
                Anon
              </p>
              <p>
                <span className="font-semibold">Telepon:</span><br />
                Anon
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}