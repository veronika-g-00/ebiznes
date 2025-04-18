package controllers

import models.Product

import play.api.mvc._
import play.api.libs.json._
import javax.inject._

@Singleton
class ProductController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {

  private var products: List[Product] = List(
    Product(1, "Product nr 1", 3000.0),
    Product(2, "Product nr 2", 1500.0)
  )
  private var itemCounter: Long = 3

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(products))
  }

  def getById(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(product) => Ok(Json.toJson(product))
      case None => NotFound
    }
  }

  def create: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { product =>
      val newProduct = product.copy(id = itemCounter)
      itemCounter += 1
      products = products :+ newProduct
      Created(Json.toJson(newProduct))
    }.getOrElse(BadRequest("Invalid product data format"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Product].map { updatedProduct =>
      products.find(_.id == id) match {
        case Some(_) =>
          products = products.filterNot(_.id == id) :+ updatedProduct.copy(id = id)
          Ok(Json.toJson(updatedProduct))
        case None => NotFound
      }
    }.getOrElse(BadRequest("Invalid product data format"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    products.find(_.id == id) match {
      case Some(_) =>
        products = products.filterNot(_.id == id)
        NoContent
      case None => NotFound
    }
  }
}