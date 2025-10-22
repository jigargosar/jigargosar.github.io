// Add copy buttons to all code blocks
document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll('pre')

  codeBlocks.forEach((pre) => {
    const wrapper = document.createElement('div')
    wrapper.style.position = 'relative'

    const button = document.createElement('button')
    button.textContent = 'Copy'
    button.className = 'copy-button'
    button.style.position = 'absolute'
    button.style.top = '0.5rem'
    button.style.right = '0.5rem'
    button.style.padding = '0.25rem 0.5rem'
    button.style.fontSize = '0.75rem'
    button.style.background = 'rgba(255, 255, 255, 0.1)'
    button.style.color = '#a0aec0'
    button.style.border = '1px solid rgba(255, 255, 255, 0.2)'
    button.style.borderRadius = '0.25rem'
    button.style.cursor = 'pointer'
    button.style.opacity = '0'
    button.style.transition = 'opacity 0.2s'

    button.addEventListener('click', async () => {
      const code = pre.querySelector('code')
      const text = code.textContent

      await navigator.clipboard.writeText(text)

      button.textContent = 'Copied!'
      setTimeout(() => {
        button.textContent = 'Copy'
      }, 2000)
    })

    pre.parentNode.insertBefore(wrapper, pre)
    wrapper.appendChild(pre)
    wrapper.appendChild(button)

    wrapper.addEventListener('mouseenter', () => {
      button.style.opacity = '1'
    })
    wrapper.addEventListener('mouseleave', () => {
      button.style.opacity = '0'
    })
  })
})
