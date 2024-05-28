'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import { toast } from 'react-hot-toast'


import logoImage from './logo.png'
import loadingImage from './spinner.gif'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [view, setView] = useState('sign-in-magic')
  const router = useRouter()
  const supabase = createClientComponentClient()
  

  

  const Styles = {
    divStyles: {
        width: "100%",
        color: "#424141",
    },
    pStyles: {
        background: "#F2F2F2",
    },
    borderShadowStyles: {
        border: "1px solid #424141",
        paddingRight: "14px",
        color: "rgb(163 163 163/var(--tw-text-opacity))",
    },
    textStyles: {
        color: "black",
    },   
    InfoText: {
        twTextOpacity: "1",
        color: "rgb(163 163 163/var(--tw-text-opacity))",
        fontSize: "14px",
    },  
    textLink: {
       color: "#FFCC00",
       textDecoration: "underline",
    },  
    textleftspace: {
       marginLeft: "16px",
       accentColor: "#fecc00",
    }, 
    headText: {
       textAlign: "center",
       color: "#F2F2F2",
       fontSize: "32px",
       marginBottom: "24px",
    }, 
    loadingStyles: {
	margin: "auto",
	display: "block",
    },

};
         

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    setView('check-email')
  }

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    await supabase.auth.signInWithPassword({
      email,
      password,
    })
    router.push('/')
  }



  const handleSignInWithMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) {
      toast.error(error.message)
    } else {
      setView('check-email')
    }
setLoading(false);
  }

  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="h-screen w-screen flex justify-center">
      <div className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2">
        {view === 'check-email' ? (
          <>
              <div className="flex justify-center mb-12">
                <Image
                  src={logoImage}
                  alt="AI Chatbot"
                  style={{boxShadow: 'inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3)' }}
                />
              </div>  
    
          
              <p className="text-center text-neutral-400">
                Check <span className="font-bold" style={{color: '#777' }}>{email}</span> to
                continue
              </p>
          </>
        ) : (
          <form
            className="flex-1 flex flex-col w-full max-w-sm justify-center gap-2"
            onSubmit={view === 'sign-in' ? handleSignIn : view === 'sign-in-magic' ? handleSignInWithMagicLink : handleSignUp}
          >

            <div style={{textAlign: 'center', color: '#424141', fontSize: '32px', marginBottom: '24px' }}> AI Chatbot 1 </div>

            
            <div className="flex justify-center mb-12">
              <Image
                src={logoImage}
                alt="AI Chatbot"
                style={{boxShadow: 'inset 0 -3em 3em rgba(0, 0, 0, 0.1), 0 0 0 2px rgb(255, 255, 255), 0.3em 0.3em 1em rgba(0, 0, 0, 0.3)' }}
              />
            </div>   
            


              <div className="card mb-6" style={Styles.pStyles}>
                <div className="card-body" style={Styles.borderShadowStyles}>

                    <div className="relative m-auto flex p-4 text-base md:max-w-2xl md:gap-6 md:py-6 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
                       <div className="min-w-[40px] text-right font-bold">
                          <svg fill="#ffa200" width="50px" height="50px" viewBox="-441.6 -441.6 2803.20 2803.20" xmlns="http://www.w3.org/2000/svg" stroke="#ffa200" stroke-width="0.019200000000000002">
                             <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                             <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="38.4"></g>
                             <g id="SVGRepo_iconCarrier">
                                <path d="M960 0c530.193 0 960 429.807 960 960s-429.807 960-960 960S0 1490.193 0 960 429.807 0 960 0Zm0 101.053c-474.384 0-858.947 384.563-858.947 858.947S485.616 1818.947 960 1818.947 1818.947 1434.384 1818.947 960 1434.384 101.053 960 101.053Zm-42.074 626.795c-85.075 39.632-157.432 107.975-229.844 207.898-10.327 14.249-10.744 22.907-.135 30.565 7.458 5.384 11.792 3.662 22.656-7.928 1.453-1.562 1.453-1.562 2.94-3.174 9.391-10.17 16.956-18.8 33.115-37.565 53.392-62.005 79.472-87.526 120.003-110.867 35.075-20.198 65.9 9.485 60.03 47.471-1.647 10.664-4.483 18.534-11.791 35.432-2.907 6.722-4.133 9.646-5.496 13.23-13.173 34.63-24.269 63.518-47.519 123.85l-1.112 2.886c-7.03 18.242-7.03 18.242-14.053 36.48-30.45 79.138-48.927 127.666-67.991 178.988l-1.118 3.008a10180.575 10180.575 0 0 0-10.189 27.469c-21.844 59.238-34.337 97.729-43.838 138.668-1.484 6.37-1.484 6.37-2.988 12.845-5.353 23.158-8.218 38.081-9.82 53.42-2.77 26.522-.543 48.24 7.792 66.493 9.432 20.655 29.697 35.43 52.819 38.786 38.518 5.592 75.683 5.194 107.515-2.048 17.914-4.073 35.638-9.405 53.03-15.942 50.352-18.932 98.861-48.472 145.846-87.52 41.11-34.26 80.008-76 120.788-127.872 3.555-4.492 3.555-4.492 7.098-8.976 12.318-15.707 18.352-25.908 20.605-36.683 2.45-11.698-7.439-23.554-15.343-19.587-3.907 1.96-7.993 6.018-14.22 13.872-4.454 5.715-6.875 8.77-9.298 11.514-9.671 10.95-19.883 22.157-30.947 33.998-18.241 19.513-36.775 38.608-63.656 65.789-13.69 13.844-30.908 25.947-49.42 35.046-29.63 14.559-56.358-3.792-53.148-36.635 2.118-21.681 7.37-44.096 15.224-65.767 17.156-47.367 31.183-85.659 62.216-170.048 13.459-36.6 19.27-52.41 26.528-72.201 21.518-58.652 38.696-105.868 55.04-151.425 20.19-56.275 31.596-98.224 36.877-141.543 3.987-32.673-5.103-63.922-25.834-85.405-22.986-23.816-55.68-34.787-96.399-34.305-45.053.535-97.607 15.256-145.963 37.783Zm308.381-388.422c-80.963-31.5-178.114 22.616-194.382 108.33-11.795 62.124 11.412 115.76 58.78 138.225 93.898 44.531 206.587-26.823 206.592-130.826.005-57.855-24.705-97.718-70.99-115.729Z" fill-rule="evenodd"></path>
                             </g>
                          </svg>
                       </div>
                       <div className="prose mt-[-2px] w-full dark:prose-invert">
                          <div className="flex flex-row">
                             <div className="prose dark:prose-invert flex-1">
                                <p style={Styles.InfoText}>I confirm that I have completed the xxx</p>
                             </div>
                             <div className="md:-mr-8 ml-1 md:ml-0 flex flex-col md:flex-row gap-4 md:gap-1 items-center md:items-start justify-end md:justify-start">
                                <button className="invisible group-hover:visible focus:visible text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" className="tabler-icon tabler-icon-copy">
                                      <path d="M8 8m0 2a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8a2 2 0 0 1 -2 2h-8a2 2 0 0 1 -2 -2z"></path>
                                      <path d="M16 8v-2a2 2 0 0 0 -2 -2h-8a2 2 0 0 0 -2 2v8a2 2 0 0 0 2 2h2"></path>
                                   </svg>
                                </button>
                             </div>
                          </div>
                       </div>
                    </div>

                  
                  
                </div>
              </div>

            
            
            <div>
                <label className="text-md text-neutral-400">Accept terms and conditions</label>  
                <input  style={Styles.textleftspace}
                        type="checkbox"
                        checked={disabled}
                        onChange={(e) => setDisabled(e.target.checked)}
                 />
            </div>
            

              <div>                  
                  <input type="text" 
                         className="rounded-md px-4 py-2 bg-inherit border mb-6 text-neutral-100"
                         style={Styles.divStyles}
                         name="email"
                         onChange={(e) => setEmail(e.target.value)}
                         value={email}
                         placeholder="you@example.com"
                         disabled={!disabled} />
              </div>            
          
            {view !== 'sign-in-magic' ? (
              <>
                <label className="text-md text-neutral-400" htmlFor="password">
                  Password
                </label>
                <input
                  className="rounded-md px-4 py-2 bg-inherit border mb-6 text-neutral-100"
                  type="password"
                  name="password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                  placeholder="••••••••"
                />
              </>
            ) : null}
            {view === 'sign-in' ? (
              <>
                <button className="bg-green-700 rounded px-4 py-2 text-neutral-200 mb-6">
                  Sign In
                </button>
                <p className="text-sm text-neutral-500 text-center">
                  Don&apos;t have an account?
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-up')}
                  >
                    Sign Up Now
                  </button>
                  &nbsp;or&nbsp;
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-in-magic')}
                  >
                    Sign In
                  </button>
                </p>
              </>
            ) : null}
            {view === 'sign-in-magic' ? (
              <>                 
                <div className="loader-container">
      	          <div className="spinner">
                    {loading ? <><Image src={loadingImage} alt="loading" style={Styles.loadingStyles}/></> : <></>}
                  </div>
                </div> 
                <button className="bg-green-700 rounded px-4 py-2 text-neutral-200 mb-6" disabled={!disabled}>
                  Sign In
                </button>
                {/* <p className="text-sm text-neutral-500 text-center">
                  Don&apos;t have an account?
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-up')}
                  >
                    Sign Up Now
                  </button>
                  &nbsp;or&nbsp;
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-in')}
                  >
                    Sign In
                  </button>
                </p> */}
              </>
            ) : null}
            {view === 'sign-up' ? (
              <>
                <button className="bg-green-700 rounded px-4 py-2 text-neutral-200 mb-6">
                  Sign Up
                </button>
                <p className="text-sm text-neutral-500 text-center">
                  Already have an account?
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-in')}
                  >
                    Sign In Now
                  </button>
                  &nbsp;or&nbsp;
                  <button
                    className="ml-1 text-white underline"
                    onClick={() => setView('sign-in-magic')}
                  >
                    Sign In
                  </button>
                </p>
              </>
            ) : null}
          </form>
        )}
      </div>
    </div>
  )
}
