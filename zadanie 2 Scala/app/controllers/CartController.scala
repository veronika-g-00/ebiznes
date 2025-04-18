package controllers

import models.Cart
import play.api.mvc._
import play.api.libs.json._
import javax.inject._

@Singleton
class CartController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {

  import Cart.cartFormat

  private var carts: List[Cart] = List()
  private var itemCounter: Long = 1

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(carts))
  }

  def getById(id: Long): Action[AnyContent] = Action {
    carts.find(_.id == id) match {
      case Some(cart) => Ok(Json.toJson(cart))
      case None => NotFound
    }
  }

  def create: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Cart].map { cart =>
      val newCart = cart.copy(id = itemCounter)
      itemCounter += 1
      carts = carts :+ newCart
      Created(Json.toJson(newCart))
    }.getOrElse(BadRequest("Malformed cart data detected"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Cart].map { updatedCart =>
      carts.find(_.id == id) match {
        case Some(_) =>
          carts = carts.filterNot(_.id == id) :+ updatedCart.copy(id = id)
          Ok(Json.toJson(updatedCart))
        case None => NotFound
      }
    }.getOrElse(BadRequest("Malformed cart data detected"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    carts.find(_.id == id) match {
      case Some(_) =>
        carts = carts.filterNot(_.id == id)
        NoContent
      case None => NotFound
    }
  }
}