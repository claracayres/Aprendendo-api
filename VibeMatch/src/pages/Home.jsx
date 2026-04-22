import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginWithSpotify } from "../services/auth";
import Navbar from "../components/HomeNav";
import ColorBends from "../components/ColorBends";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("spotify_access_token");

    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-white">
      <Navbar />

      <div className="absolute inset-0 -z-20">
        <ColorBends
          rotation={90}
          speed={0.2}
          colors={["#5227FF", "#FF9FFC", "#7cff67"]}
          transparent
          autoRotate={0.65}
          scale={1}
          frequency={1}
          warpStrength={1}
          mouseInfluence={1.3}
          parallax={0.5}
          noise={0}
          iterations={1}
          intensity={0.45}
          bandWidth={6}
        />
      </div>

      <div className="absolute inset-0 -z-10 bg-black/45" />

      <main className="relative z-10">
        {/* HERO */}
        <section className="mx-auto grid min-h-screen max-w-7xl grid-cols-1 items-center gap-14 px-6 pt-28 pb-16 lg:grid-cols-2">
          <div className="animate-[fadeUp_.8s_ease]">
            <span className="mb-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.25em] text-white/70 backdrop-blur-md">
              Compatibilidade musical em segundos
            </span>

            <h1 className="max-w-2xl text-5xl font-black leading-tight md:text-6xl lg:text-7xl">
              Descubra sua{" "}
              <span className="bg-gradient-to-r from-white via-[#FF9FFC] to-[#7cff67] bg-clip-text text-transparent">
                compatibilidade musical
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
              Conecte seu Spotify, compare vibes e veja artistas, músicas e
              gêneros em comum. Simples, rápido e divertido.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <button
                onClick={loginWithSpotify}
                className="rounded-full bg-[#7cff67] px-7 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:shadow-[0_0_30px_rgba(124,255,103,0.35)]"
              >
                Connect Spotify
              </button>

              <a
                href="#como-funciona"
                className="rounded-full border border-white/15 bg-white/5 px-7 py-4 text-base font-semibold text-white backdrop-blur-md transition hover:bg-white/10"
              >
                Ver como funciona
              </a>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="absolute h-72 w-72 rounded-full bg-[#5227FF]/30 blur-3xl" />
            <div className="absolute right-10 top-10 h-48 w-48 rounded-full bg-[#FF9FFC]/20 blur-3xl" />

            <div className="relative flex w-full max-w-md items-center justify-center">
              <div className="absolute left-0 top-8 w-56 rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl shadow-2xl rotate-[-8deg] transition hover:-translate-y-1">
                <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-[#5227FF] to-[#FF9FFC]" />
                <p className="text-3xl font-black text-white">90%</p>
                <p className="mt-1 text-sm text-white/70">match</p>
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-white/10" />
                  <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  <div className="h-2 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="absolute right-0 top-32 w-52 rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-xl shadow-2xl rotate-[8deg] transition hover:-translate-y-1">
                <div className="mb-4 h-12 w-12 rounded-full bg-gradient-to-br from-[#FF9FFC] to-[#7cff67]" />
                <p className="text-3xl font-black text-white">70%</p>
                <p className="mt-1 text-sm text-white/70">match</p>
                <div className="mt-4 space-y-2">
                  <div className="h-2 rounded-full bg-white/10" />
                  <div className="h-2 w-4/5 rounded-full bg-white/10" />
                  <div className="h-2 w-2/3 rounded-full bg-white/10" />
                </div>
              </div>

              <div className="h-[430px] w-[320px] rounded-[32px] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6 backdrop-blur-2xl shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-white/60">VibeMatch</p>
                    <h3 className="text-2xl font-bold">Seu match musical</h3>
                  </div>
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5227FF] via-[#FF9FFC] to-[#7cff67]" />
                </div>

                <div className="mt-8 rounded-3xl border border-white/10 bg-black/20 p-5">
                  <p className="text-sm text-white/60">Compatibilidade</p>
                  <p className="mt-2 text-6xl font-black">87%</p>
                  <div className="mt-4 h-3 rounded-full bg-white/10">
                    <div className="h-3 w-[87%] rounded-full bg-gradient-to-r from-[#5227FF] via-[#FF9FFC] to-[#7cff67]" />
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60">Artistas em comum</p>
                    <p className="mt-2 text-xl font-bold">12</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs text-white/60">Músicas em comum</p>
                    <p className="mt-2 text-xl font-bold">28</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* COMO FUNCIONA */}
        <section
          id="como-funciona"
          className="mx-auto max-w-7xl px-6 py-24"
        >
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Como funciona
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Simples. Rápido. Divertido.
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                n: "1",
                title: "Conecte-se",
                text: "Entre com Spotify e deixe a plataforma analisar seu universo musical.",
              },
              {
                n: "2",
                title: "Compare com alguém",
                text: "Use QR Code ou link de perfil para comparar sua vibe com outra pessoa.",
              },
              {
                n: "3",
                title: "Veja o resultado",
                text: "Descubra compatibilidade, artistas em comum, gêneros favoritos e mood da semana.",
              },
            ].map((item) => (
              <div
                key={item.n}
                className="rounded-[28px] border border-white/10 bg-white/5 p-8 backdrop-blur-xl transition hover:-translate-y-2 hover:bg-white/8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#5227FF] to-[#FF9FFC] text-lg font-black">
                  {item.n}
                </div>
                <h3 className="text-2xl font-bold">{item.title}</h3>
                <p className="mt-4 leading-7 text-white/70">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* DATE / STORY BLOCK */}
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-24 lg:grid-cols-2">
          <div className="rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Date mode
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight md:text-5xl">
              Descubra a vibe no meio do date.
            </h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/70">
              Conheceu alguém e quer saber se o gosto musical bateu? Escaneia,
              compara e vê na hora se a conexão vai além da conversa.
            </p>
            <button
              onClick={loginWithSpotify}
              className="mt-8 rounded-full bg-white px-6 py-3 font-bold text-black transition hover:scale-[1.02]"
            >
              Testar agora
            </button>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-gradient-to-br from-[#5227FF]/20 via-white/5 to-[#FF9FFC]/10 p-10 backdrop-blur-xl">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Mais do que um match
            </p>
            <h2 className="mt-4 text-4xl font-black leading-tight">
              Sua música revela sua vibe.
            </h2>
            <p className="mt-6 text-lg leading-8 text-white/70">
              Não é só sobre porcentagem. É sobre descobrir energia, estilo,
              artistas em comum, músicas compartilhadas e até o humor da semana.
            </p>
          </div>
        </section>

        {/* FEATURES */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-6 py-24"
        >
          <div className="mb-14">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Features
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Tudo que faz o match ficar interessante
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {[
              "Compatibilidade musical",
              "Artistas em comum",
              "Músicas compartilhadas",
              "Gêneros favoritos",
              "Mood da semana",
              "Comparação por QR Code",
            ].map((feature, index) => (
              <div
                key={feature}
                className="group rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/8"
              >
                <div className="mb-5 h-12 w-12 rounded-2xl bg-gradient-to-br from-[#5227FF] via-[#FF9FFC] to-[#7cff67] opacity-90 transition group-hover:scale-110" />
                <h3 className="text-2xl font-bold">{feature}</h3>
                <p className="mt-3 leading-7 text-white/70">
                  Feature {index + 1} da sua plataforma para transformar
                  descoberta musical em experiência divertida e social.
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="mx-auto max-w-7xl px-6 py-24">
          <div className="mb-14 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              Social proof
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              A galera já está descobrindo a própria vibe
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              "Usei no rolê e virou assunto na hora. Muito mais divertido que só trocar @.",
              "Gostei porque mostra artistas em comum e deixa a conexão mais real.",
              "A ideia do QR Code no date é boa demais. Tem muita cara de app viral.",
            ].map((text, i) => (
              <div
                key={i}
                className="rounded-[28px] border border-white/10 bg-white/5 p-7 backdrop-blur-xl"
              >
                <div className="mb-5 h-12 w-12 rounded-full bg-gradient-to-br from-[#FF9FFC] to-[#7cff67]" />
                <p className="leading-7 text-white/75">{text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-5xl px-6 py-24"
        >
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-white/50">
              FAQ
            </p>
            <h2 className="mt-4 text-4xl font-black md:text-5xl">
              Dúvidas frequentes
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Preciso ter Spotify Premium?",
                a: "Não. Basta ter uma conta Spotify conectada para analisar seus dados disponíveis.",
              },
              {
                q: "Como comparo com outra pessoa?",
                a: "Você pode usar QR Code, link de perfil ou outros fluxos que você adicionar depois no produto.",
              },
              {
                q: "O match mostra o quê?",
                a: "Compatibilidade geral, artistas em comum, músicas, gêneros e insights sobre a vibe da semana.",
              },
              {
                q: "Isso é só para dates?",
                a: "Nada disso. Serve para amigos, festas, rolês e qualquer situação em que música diga muito sobre alguém.",
              },
            ].map((item) => (
              <details
                key={item.q}
                className="group rounded-[24px] border border-white/10 bg-white/5 p-6 backdrop-blur-xl"
              >
                <summary className="cursor-pointer list-none text-lg font-bold">
                  <div className="flex items-center justify-between gap-4">
                    <span>{item.q}</span>
                    <span className="text-white/50 transition group-open:rotate-180">
                      ˅
                    </span>
                  </div>
                </summary>
                <p className="mt-4 leading-7 text-white/70">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <section className="mx-auto max-w-7xl px-6 pb-24">
          <div className="rounded-[36px] border border-white/10 bg-gradient-to-r from-[#5227FF]/25 via-[#FF9FFC]/10 to-[#7cff67]/20 p-10 text-center backdrop-blur-2xl md:p-14">
            <h2 className="text-4xl font-black md:text-5xl">
              Pronta para descobrir sua vibe?
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-white/75">
              Transforme gosto musical em conexão, conversa e experiência.
            </p>
            <button
              onClick={loginWithSpotify}
              className="mt-8 rounded-full bg-[#7cff67] px-8 py-4 text-base font-bold text-black transition hover:scale-[1.03] hover:shadow-[0_0_35px_rgba(124,255,103,0.35)]"
            >
              Entrar com Spotify
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}