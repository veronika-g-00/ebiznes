package controllers

import models.Category
import play.api.mvc._
import play.api.libs.json._
import javax.inject._

@Singleton
class CategoryController @Inject()(val controllerComponents: ControllerComponents) 
  extends BaseController {

  import Category.categoryFormat

  private var categories: List[Category] = List()
  private var itemCounter: Long = 1

  def getAll: Action[AnyContent] = Action {
    Ok(Json.toJson(categories))
  }

  def getById(id: Long): Action[AnyContent] = Action {
    categories.find(_.id == id) match {
      case Some(category) => Ok(Json.toJson(category))
      case None => NotFound
    }
  }

  def create: Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].map { category =>
      val newCategory = category.copy(id = itemCounter)
      itemCounter += 1
      categories = categories :+ newCategory
      Created(Json.toJson(newCategory))
    }.getOrElse(BadRequest("Invalid category payload structure"))
  }

  def update(id: Long): Action[JsValue] = Action(parse.json) { request =>
    request.body.validate[Category].map { updatedCategory =>
      categories.find(_.id == id) match {
        case Some(_) =>
          categories = categories.filterNot(_.id == id) :+ updatedCategory.copy(id = id)
          Ok(Json.toJson(updatedCategory))
        case None => NotFound
      }
    }.getOrElse(BadRequest("Invalid category payload structure"))
  }

  def delete(id: Long): Action[AnyContent] = Action {
    categories.find(_.id == id) match {
      case Some(_) =>
        categories = categories.filterNot(_.id == id)
        NoContent
      case None => NotFound
    }
  }
}