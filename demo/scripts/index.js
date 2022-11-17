class Accordion {
  static #OPENED = "opened"
  static #OPENING = "opening"
  static #CLOSED = "closed"
  static #CLOSING = "closing"

  #details
  #summary
  #content
  #duration = 300
  #durationName = "--accordion-duration"
  #timingFunction = "ease"
  #timingFunctionName = "--accordion-timing-function"
  #delay = 0
  #delayName = "--accordion-delay"
  #activeClass = "AccordionIsOpen"
  #_status

  constructor(options) {
    if (!options.target) throw new Error("'target' must need Element.")

    this.#details = options.target
    this.#summary = this.#details.querySelector("summary")
    this.#content = this.#details.querySelector("summary + *")
    this.#status = options.isOpenOnDefault
      ? Accordion.#OPENED
      : Accordion.#CLOSED

    this.#duration = options.duration ?? this.#duration
    this.#durationName = options.durationName ?? "--accordion-duration"
    this.#details.style.setProperty(this.#durationName, this.#duration + "ms")

    this.#timingFunction = options.timingFunction ?? this.#timingFunction

    this.#timingFunctionName =
      options.timingFunctionName ?? "--accordion-timing-function"
    this.#details.style.setProperty(
      this.#timingFunctionName,
      this.#timingFunction
    )

    this.#delay = options.delay ?? this.#delay
    this.#delayName = options.delayName ?? "--accordion-delay"
    this.#details.style.setProperty(this.#delayName, this.#delay)

    this.#details.style.transition = `height ${this.#duration}ms ${
      this.#timingFunction
    } ${this.#delay}ms`
    this.#details.style.overflow = "hidden"

    this.#activeClass = options.activeClass ?? this.#activeClass

    this.#summary.addEventListener("click", (event) => this.#toggle(event))

    this.#details.addEventListener("transitionend", () =>
      this.#onTransitionEnd()
    )
  }

  get #status() {
    return this.#_status
  }

  set #status(status) {
    this.#_status = status

    switch (status) {
      case Accordion.#OPENED:
        this.#details.setAttribute("open", "")
        this.#details.classList.add(this.#activeClass)
        this.#details.style.height = "auto"
        break

      case Accordion.#OPENING:
        this.#details.setAttribute("open", "")
        this.#details.classList.add(this.#activeClass)
        this.#details.style.height = this.#openingHeight
        break

      case Accordion.#CLOSED:
        this.#details.removeAttribute("open")
        this.#details.classList.remove(this.#activeClass)
        this.#details.style.height = "auto"
        break

      case Accordion.#CLOSING:
        this.#details.setAttribute("open", "")
        this.#details.classList.remove(this.#activeClass)
        this.#details.style.height = this.#closingHeight
        break
    }
  }
  get #openingHeight() {
    return (
      this.#summary.getBoundingClientRect().height +
      this.#content.getBoundingClientRect().height +
      this.#getVerticalBorderWidth() +
      "px"
    )
  }
  get #closingHeight() {
    return (
      this.#summary.getBoundingClientRect().height +
      this.#getVerticalBorderWidth() +
      "px"
    )
  }

  #getVerticalBorderWidth() {
    const computedStyle = getComputedStyle(this.#details)
    const borderTopWidth = parseInt(
      computedStyle.getPropertyValue("border-top-width")
    )
    const borderBottomWidth = parseInt(
      computedStyle.getPropertyValue("border-bottom-width")
    )
    return borderTopWidth + borderBottomWidth
  }

  #toggle(event) {
    event.preventDefault()

    switch (this.#status) {
      case Accordion.#OPENED:
        this.#details.style.height = this.#openingHeight
        setTimeout(() => {
          this.#status = Accordion.#CLOSING
        }, 10)
        break

      case Accordion.#OPENING:
        this.#status = Accordion.#CLOSING
        break

      case Accordion.#CLOSED:
        this.#details.style.height = this.#closingHeight
        setTimeout(() => {
          this.#status = Accordion.#OPENING
        }, 10)

        break

      case Accordion.#CLOSING:
        this.#status = Accordion.#OPENING
        break
    }
  }

  #onTransitionEnd() {
    if (this.#status === Accordion.#CLOSING) {
      this.#status = Accordion.#CLOSED
      return
    }

    if (this.#status === Accordion.#OPENING) {
      this.#status = Accordion.#OPENED
      return
    }
  }
}

document.querySelectorAll(".Accordion").forEach((element, index) => {
  new Accordion({
    target: element,
    duration: 400,
    easing: "ease",
    isOpenOnDefault: index === 0,
  })
})
